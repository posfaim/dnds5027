---
title: "Session 09 — Reading and writing files"
subtitle: "Python for Everyone · Lecture notes"
---

> **How to read the code boxes:** grey boxes with a yellow bar contain Python
> code. The box labelled **Output** next to it (or below it) shows what Python
> prints when you run that code. In a Jupyter notebook, if the last line of a
> cell is just a value (like `line` below), the notebook displays it; this is
> also shown as output.

## Files

- Most of the data we work with comes in files, typically **csv** files (comma
  separated values). A csv is a **plain text** file: no formatting, no images,
  just text. For example, `example.csv`:

```text
Name,Height
Adam,180
Belzebub,220
Papa Smurf,10
```

- **Text files** (csv, txt, html, ...) store characters. **Binary files**
  (images, audio, zip, ...) can store anything. An xls or doc file is not plain
  text, and harder to read with Python. Here we focus on text files.
- A file is a sequence of 1s and 0s. The **character encoding** is the rule that
  translates between them and characters (more at the end).
- The **working directory** is the folder where Python looks for files by
  default, and where it saves them. Usually it is the folder of your notebook.
  The magic command `%pwd` displays its location.

## Reading a file

- `open` gives a **file handle**, and `.read()` reads the whole file into a
  string:

```python
f = open('example.csv')
contents = f.read()
print(contents)
```

```output
Name,Height
Adam,180
Belzebub,220
Papa Smurf,10
```

- The file handle keeps track of where it is in the file. After `.read()` it is
  at the end, so another `f.read()` gives an empty string `''`. To start over,
  open the file again (see this
  [demo](https://posfaim.github.io/dnds5027/web_classes/file_open_demo.html)).

## Reading line by line

- `.readline()` reads one line. Each line ends with the line break `\n`:

```python
f = open('example.csv')
line = f.readline()
line
```

```output
'Name,Height\n'
```

::: pagebreak
:::

- A `for` loop over the file handle goes through the lines one by one. `print`
  adds its own line break, so this gives empty lines:

```python
f = open('example.csv')
for line in f:
    print(line)
```

```output
Name,Height

Adam,180

Belzebub,220

Papa Smurf,10

```

- `print(line, end='')` does not add a line break, so it avoids the empty lines.
- When you are done, close the file with `f.close()`. Reading a closed file gives
  `ValueError: I/O operation on closed file.` Not closing a file mainly causes
  trouble when you write to it.

## The `with` statement

- A better way to open files: the file is open inside the **indented** block, and
  Python closes it when the block ends.

```python
with open('example.csv') as f:
    for line in f:
        print(line, end='')
```

```output
Name,Height
Adam,180
Belzebub,220
Papa Smurf,10
```

## Absolute and relative paths

- Files are stored in folders (directories), which form a **directory tree**:

```text
/home/posfaim/teaching/python_for_everyone/2026-27/
└── notebooks/            ← working directory
    ├── class_09.ipynb
    ├── olympics.csv
    └── data/
        └── example.csv
```

- An **absolute path** starts at the top and lists every folder down to the file:
  `'/home/posfaim/teaching/python_for_everyone/2026-27/notebooks/data/example.csv'`.
  On Windows it starts with the drive, e.g. `'C:/Users/student/...'`. The code
  breaks if you move the project, or if someone else runs it on a different computer.
- A **relative path** starts from the working directory, so it only lists the
  steps from there: `'data/example.csv'`. Prefer relative paths.
- `..` means one folder up. If `data` were next to `notebooks`, the path would be
  `'../data/example.csv'`.
- Write paths with forward slashes `/`, also on Windows. The backslash `\` has a
  special meaning in strings (`\n`, `\t`).

## Parsing a csv file

- A csv file is like a table: each line is a row, and the columns are separated
  by `,`. To work with the data, we have to **parse** it: split the rows into
  entries and convert the numbers.
- `.split()` splits a string into a list: at spaces by default, or at the
  separator you give it.

```python
print("This is a sentence.".split())
print("apple,12,42,48".split(','))
```

```output
['This', 'is', 'a', 'sentence.']
['apple', '12', '42', '48']
```

```python
names = []
heights = []
with open('example.csv') as f:
    f.readline()                    # skip the header
    for line in f:
        l = line.split(',')         # split the row into entries
        names.append(l[0])
        heights.append(float(l[1])) # convert the height to a number
print(names)
print(heights)
```

```output
['Adam', 'Belzebub', 'Papa Smurf']
[180.0, 220.0, 10.0]
```

- Parsing gets complicated quickly. The packages `csv` and `pandas` help.

## Writing files

- `'w'` opens a file for **writing**. If the file does not exist, Python creates
  it. If it exists, Python **overwrites** it: the previous contents are lost.
- `.write()` does not add a line break: add `'\n'` yourself.

```python
with open('output.csv', 'w') as f:
    for name in names:
        f.write(name + '\n')
```

- `'a'` **appends** to the end of an existing file:

```python
new_names = ['Humpty Dumpty', 'Ms. Frizzle']
with open('output.csv', 'a') as f:
    for name in new_names:
        f.write(name + '\n')

with open('output.csv') as f:
    contents = f.read()
contents
```

```output
'Adam\nBelzebub\nPapa Smurf\nHumpty Dumpty\nMs. Frizzle\n'
```

- To save a dictionary, loop over `.items()` and write each pair with an
  f-string: `f.write(f"{key},{value}\n")`.

## Character encoding

- For plain English text, almost all encodings agree. Accented letters (é, ö, ő,
  ñ, ...) are stored differently in each. **UTF-8** is the most widely used
  encoding, and it can store every character of every language
  ([slides](https://posfaim.github.io/dnds5027/slides/text_encoding.pdf)).
- Without the `encoding` argument, `open()` uses your computer's default
  (`locale.getpreferredencoding()`): `'UTF-8'` on Mac and Linux, but on Windows
  often an older one, e.g. `'cp1252'` (Western Europe) or `'cp1250'` (Central
  Europe). From Python 3.15, the default is UTF-8 everywhere.
- **Always give the encoding**, for reading and for writing. A file saved as
  UTF-8 and opened with another encoding comes out garbled (`é` → `Ã©`):

```python
accented_names = ['José', 'Zoë', 'Søren', 'Müller']
with open('accents.csv', 'w', encoding='utf-8') as f:
    for name in accented_names:
        f.write(name + '\n')

# read it back with the wrong encoding
with open('accents.csv', encoding='cp1252') as f:
    for line in f:
        print(line, end='')
```

```output
JosÃ©
ZoÃ«
SÃ¸ren
MÃ¼ller
```

- The other way round, a `'cp1252'` file opened as UTF-8 gives a
  `UnicodeDecodeError`. Then try `encoding='cp1252'` (or `'cp1250'`).
- Excel on Windows saves "CSV" in the older encoding: choose **CSV UTF-8** in
  *Save as*. For a csv that someone will open in Excel, write it with
  `encoding='utf-8-sig'`.

::: {.box .mistakes}
### Common mistakes

- **File not found:** `FileNotFoundError` means the file is not where the path
  says. Check the working directory with `%pwd`, and the path.
- **Reading a file twice:** the second `f.read()` gives `''`, without an error.
  Open the file again.
- **The line break stays in the last column:** `'Paris,2024\n'.split(',')` gives
  `['Paris', '2024\n']`. `int` and `float` ignore it, but text keeps it:
  `'Brazil\n' == 'Brazil'` is `False`. Use `line.strip().split(',')`.
- **Skipping a header that is not there:** if the file has no header,
  `f.readline()` silently throws away the first row of data. Look at the file
  first.
- **Writing with `'w'` instead of `'a'`:** the file is overwritten without
  warning, and the old contents are lost.
:::

## Summary

| Term / code                   | Meaning                                                   |
|-------------------------------|-----------------------------------------------------------|
| working directory             | the folder where Python looks for files; `%pwd`           |
| `f = open('a.csv')`           | open a file for reading; `f` is the file handle           |
| `f.read()`, `f.readline()`    | read the whole file / one line                            |
| `for line in f:`              | go through the file line by line                          |
| `print(line, end='')`         | print without adding a line break                         |
| `with open(...) as f:`        | open the file; it is closed when the block ends           |
| absolute / relative path      | from the top of the tree / from the working directory     |
| `..`                          | one folder up                                             |
| `s.split(',')`                | split a string into a list at the commas                  |
| `open('a.csv', 'w')`          | write: create or overwrite the file                       |
| `open('a.csv', 'a')`          | append to the end of the file                             |
| `f.write(s)`                  | write the string `s`; add `'\n'` yourself                 |
| `encoding='utf-8'`            | read or write the file as UTF-8                           |
