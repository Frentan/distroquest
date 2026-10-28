"""Bounded Markdown link tokenizer for DistroQuest.

Keep the explicit link grammar conservative; this is not a CommonMark validator.
"""

from html.parser import HTMLParser
import re
import string

UNESCAPE = re.compile(r'\\([' + re.escape(string.punctuation) + r'])')


def mask_code(text):
    """Preserve character offsets while hiding fences, inline code and comments."""
    chars = list(text)
    fence = None
    offset = 0
    for line in text.splitlines(keepends=True):
        marker = re.match(r' {0,3}(`{3,}|~{3,})(.*)', line)
        hidden = fence is not None
        if fence:
            if marker and marker[1][0] == fence[0] and len(marker[1]) >= fence[1] and not marker[2].strip():
                fence = None
        elif marker:
            fence = (marker[1][0], len(marker[1]))
            hidden = True
        elif line.startswith(('    ', '\t')):
            hidden = True  # Conservative: indented code, not nested-list inference.
        if hidden:
            for i in range(offset, offset + len(line)):
                if chars[i] != '\n':
                    chars[i] = ' '
        offset += len(line)
    masked = ''.join(chars)
    spans = [(m.start(), m.end()) for m in re.finditer(r'<!--[\s\S]*?(?:-->|\Z)', masked)]
    for a, b in spans:
        for i in range(a, b):
            if chars[i] != '\n':
                chars[i] = ' '
    masked = ''.join(chars)
    i = 0
    while i < len(masked):
        if masked[i] == '\\':
            i += 2
            continue
        if masked[i] != '`':
            i += 1
            continue
        run = re.match(r'`+', masked[i:])[0]
        closing = re.search(r'(?<!`)' + re.escape(run) + r'(?!`)', masked[i + len(run):])
        if not closing:
            i += len(run)
            continue
        end = i + len(run) + closing.end()
        for j in range(i, end):
            if chars[j] != '\n':
                chars[j] = ' '
        i = end
    return ''.join(chars)


def destination(text, start, inline=True):
    """Read a bounded Markdown destination and optional quoted title."""
    i = start
    while i < len(text) and text[i].isspace():
        i += 1
    if i == len(text):
        return None
    a = i
    if text[i] == '<':
        i += 1
        a = i
        while i < len(text) and text[i] not in '>\n':
            i += 2 if text[i] == '\\' else 1
        if i >= len(text) or text[i] != '>':
            return None
        raw = text[a:i]
        i += 1
    else:
        depth = 0
        while i < len(text):
            c = text[i]
            if c == '\\':
                i += 2
                continue
            if c.isspace() or (c == ')' and depth == 0):
                break
            if c == '(':
                depth += 1
            elif c == ')':
                depth -= 1
            i += 1
        if depth:
            return None
        raw = text[a:i]
    while i < len(text) and text[i].isspace():
        i += 1
    if i < len(text) and text[i] in '\"\'':
        quote = text[i]
        i += 1
        while i < len(text) and text[i] != quote:
            i += 2 if text[i] == '\\' else 1
        if i == len(text):
            return None
        i += 1
        while i < len(text) and text[i].isspace():
            i += 1
    if inline:
        return (raw, i + 1) if i < len(text) and text[i] == ')' else None
    return (raw, i) if i == len(text) else None


def reference_key(label):
    return ' '.join(label.split()).casefold()


def markdown_links(text):
    """Return (occurrences, limitations); offsets refer to the original text."""
    masked = mask_code(text)
    refs = {}
    issues = []
    chars = list(masked)
    for m in re.finditer(r'^ {0,3}\[([^\]\n]+)\]:[^\n]*', masked, re.M):
        if m[1].startswith('^'):
            continue  # Footnote text can itself contain real links.
        tail = masked[m.start():m.end()]
        colon = tail.index(']:') + 2
        parsed = destination(tail, colon, inline=False)
        if parsed:
            key = reference_key(m[1])
            if key in refs:
                issues.append((m.start(), 'duplicate_reference_definition'))
            else:
                refs[key] = (parsed[0], m.start())
        else:
            issues.append((m.start(), 'unsupported_reference_definition'))
        chars[m.start():m.end()] = ' ' * (m.end() - m.start())
    masked = ''.join(chars)
    links = []
    i = 0
    while i < len(masked):
        if masked[i] == '\\':
            i += 2
            continue
        image = masked.startswith('![', i)
        a = i + 1 if image else i
        if masked[a:a + 1] != '[':
            i += 1
            continue
        j, depth = a + 1, 1
        while j < len(masked) and depth:
            if masked[j] == '\\':
                j += 2
                continue
            depth += (masked[j] == '[') - (masked[j] == ']')
            j += 1
        if depth:
            i += 1
            continue
        label = masked[a + 1:j - 1]
        raw, definition, end = None, None, j
        if masked[j:j + 1] == '(':
            parsed = destination(masked, j + 1)
            if parsed:
                raw, end = parsed
            else:
                issues.append((i, 'unsupported_inline_link'))
        else:
            ref = re.match(r'\[([^\]\n]*)\]', masked[j:])
            key = reference_key((ref[1] or label) if ref else label)
            if key in refs:
                raw, definition = refs[key]
                end = j + len(ref[0]) if ref else j
            elif ref:
                issues.append((i, 'undefined_reference'))
                end = j + len(ref[0])
        if raw is not None:
            links.append({'offset': i, 'target': raw, 'resource': image, 'definition': definition})
        i = max(i + 1, end)

    class HTMLLinks(HTMLParser):
        def handle_starttag(self, tag, attrs):
            line, col = self.getpos()
            offset = starts[line - 1] + col
            if tag == 'img':
                for key, value in attrs:
                    if key == 'src' and value is not None:
                        links.append({'offset': offset, 'target': value, 'resource': True, 'definition': None})
            elif tag == 'a' and any(key == 'href' for key, _ in attrs):
                issues.append((offset, 'unsupported_html_link'))
    starts = [0] + [m.end() for m in re.finditer('\n', masked)]
    parser = HTMLLinks(convert_charrefs=True)
    parser.feed(masked)
    # Wiki links are deliberately outside the bounded relationship grammar.
    issues.extend((m.start(), 'unsupported_wikilink') for m in re.finditer(r'\[\[[^\]\n]+\]\]', masked))
    return links, issues
