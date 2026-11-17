---
title: "Session 05 — Lists"
subtitle: "Python for Everyone · Lecture notes"
---

> **How to read the code boxes:** grey boxes with a yellow bar contain Python
> code. The box labelled **Output** next to it (or below it) shows what Python
> prints when you run that code. In a Jupyter notebook, if the last line of a
> cell is just a value (like `new_s` below), the notebook displays it; this is
> also shown as output.

## Using Jupyter notebooks

- A **Jupyter notebook** combines formatted text and executable code in one
  place. It is made up of **cells**, which are either markdown or code.
- Whatever expression is on the **last line** of a code cell gets displayed. Use
  `print` to display things before the last line.

```python
s = "hello"
new_s = s.capitalize() + "!"
new_s
```

```output
'Hello!'
```

```python
x = 10
y = 12
print(f"{x} + {y} = {x+y}")
x-y
```

```output
10 + 12 = 22
-2
```

- Only expressions that evaluate to something get displayed. `x = 3.14` changes
  `x`, but displays nothing.
- **Cells can run in any order, any number of times.** A variable stays in
  Python's memory even if you delete the line that created it.
- Restarting the **kernel** deletes all variables and results. Two good ideas:
    - If you are uncertain what a variable contains, print it out.
    - When you finish a project, restart the kernel and test the code again.

## Lists

- A **list** is a **container**: it holds multiple objects. Write the elements
  in square brackets `[...]`, separated by commas. The data type of the elements can be mixed.

```python
l_num = [1, 3, 12, -1]
l_str = ['apple', 'barn', 'hopscotch']
l_mix = [1, 0.23, "wow!"]
```

## Accessing elements

- This works the same way as for strings. Indexing starts from **0**, and `-1`
  is the last element.

```python
print(l_mix[0], l_mix[1], l_mix[-1], l_mix[-2])
```

```output
1 0.23 wow! 0.23
```

::: pagebreak
:::

- **Slicing** selects a sublist. The first number is the first index **included**,
  the second is the first index **excluded**. Leave one out to go to the beginning
  or the end.

```python
print(l_mix[1:3])
print(l_mix[:2])
print(l_mix[2:])
```

```output
[0.23, 'wow!']
[1, 0.23]
['wow!']
```

- A list can contain another list. Use two indices to reach an inner element:

```python
l_mix = [1, 0.23, 'wow!', [1, 3, 12, -1]]
print(l_mix[3])
print(l_mix[3][0])
```

```output
[1, 3, 12, -1]
1
```

## List methods

- `.append()` adds an element to the end, `.count()` counts the occurrences of a
  value, `.remove()` removes the first occurrence of a value, and `.sort()`
  sorts in increasing order.

```python
l_num = [1, 3, 12, -1]
print(l_num.count(3))
l_num.append(3)
print(l_num, l_num.count(3))
l_num.remove(3)
print(l_num)
l_num.sort()
print(l_num)
l_num.sort(reverse=True)
print(l_num)
```

```output
1
[1, 3, 12, -1, 3] 2
[1, 12, -1, 3]
[-1, 1, 3, 12]
[12, 3, 1, -1]
```

## Mutable and immutable

- String methods never change the string, they return a new one. List methods
  often change the list they are called on.
- Lists are **mutable**: they can be modified in place. Strings are **immutable**:
  they cannot be modified without creating a new copy.

```python
l = [1, 2, 3]
l[1] = "wow!"
l
```

```output
[1, 'wow!', 3]
```

```python
s = "lore"
s[2] = 'v'
```

```output
TypeError: 'str' object does not support item assignment
```

::: pagebreak
:::

## Sorting in-place vs new list

- `.sort()` sorts **in-place**: it changes the list and returns nothing.
- `sorted()` creates a **new list** and leaves the original untouched.

```python
baby_weights = [3100, 4210, 3670]
sorted_baby_weights = sorted(baby_weights)
print(baby_weights)
print(sorted_baby_weights)
baby_weights.sort()
print(baby_weights)
```

```output
[3100, 4210, 3670]
[3100, 3670, 4210]
[3100, 3670, 4210]
```

## Checking contents

- The `in` operator checks if a list contains an element:

```python
my_pets = ["parrot", "gold fish", "slime mold", "frog"]
pet_type = "cat"
if pet_type in my_pets:
    print(f"I have a {pet_type}!")
else:
    print(f"I don't have a {pet_type}!")
```

```output
I don't have a cat!
```

## Useful functions

- Functions can take lists as arguments: `len` gives the number of elements, and
  `max`, `min` and `sum` do what their names say.

```python
l_num = [3, -1, 12, 5]
print(len(l_num), max(l_num), min(l_num), sum(l_num))
```

```output
4 12 -1 19
```


## Iterating over a list

- To do the same thing with every element, copy-pasting code is cumbersome, hard
  to change and not very readable. And what if you have 3 million elements?
- A **`for` loop** runs the same code for each element of a list:

```python
books = [
    'Moby Dick (1851)',
    'The world according to Garp (1978)',
    'Networks: an Introduction (2018)',
    'Portraits of Empires (2023)'
]
for book in books:
    print(book[:-7])    # title without the year
```

```output
Moby Dick
The world according to Garp
Networks: an Introduction
Portraits of Empires
```

**Anatomy of a `for` loop:**

- `for book in books:` is the **header**. It ends with a colon `:`.
- `books` is the list. More generally it can be any **iterable**: a container
  that can serve up its elements one-by-one.
- `book` is a variable that holds the **current element**.
- The **indented** block is the **body**, repeated for every element.

We can also collect the results in a new list:

```python
titles = []
for book in books:
    titles.append(book[:-7])
titles
```

```output
['Moby Dick', 'The world according to Garp', 'Networks: an Introduction', 'Portraits of Empires']
```

::: {.box .mistakes}
### Common mistakes

- **Running cells out of order:** `print(y)` gives a `NameError` if the cell with
  `y = 10` has not run yet. If something looks strange, restart the kernel and
  run the cells from the top.
- **Saving the result of `.sort()` or `.append()`:** they change the list and
  return nothing, so after `l = l.append(4)` the list is lost and `l` is `None`.
  Write just `l.append(4)`.
- **Missing comma:** `["apple" "barn"]` gives no error, but joins the two strings
  into one: `['applebarn']`.
- **`append` outside the loop:** if the line is not indented, it runs only once,
  after the loop. There is no error, but `titles` is just `['Portraits of Empires']`.

  ```python
  titles = []
  for book in books:
      title = book[:-7]
  titles.append(title)    # not indented: runs once, after the loop
  ```
:::

## Summary

| Term / code             | Meaning                                                  |
|-------------------------|----------------------------------------------------------|
| cell, kernel            | a part of a notebook; the Python running behind it       |
| `[1, "a", 2.5]`         | create a list; `[]` is an empty one                      |
| `l[0]`, `l[-1]`         | first element, last element                              |
| `l[1:3]`                | sublist from index 1 up to, but not including, index 3   |
| `l.append(x)`           | add `x` to the end of the list                           |
| `l.count(x)`            | number of occurrences of `x`                             |
| `l.remove(x)`           | remove the first occurrence of `x`                       |
| `l.sort()`              | sort the list in-place; `reverse=True` for decreasing    |
| `sorted(l)`             | return a new sorted list; `l` stays the same             |
| mutable / immutable     | can / cannot be changed in place (list / string)         |
| `x in l`                | `True` if the list contains `x`                          |
| `len`, `max`, `min`, `sum` | number of elements, largest, smallest, total          |
| `for x in l:`           | repeat the body for every element; `x` is the current one |
