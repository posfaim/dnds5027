-- Pandoc filter: wrap a code block and the ```output block right after it in
-- a Div with class "pair". Short pairs also get the class "side", which
-- style.css shows as code and output next to each other.

local MAX_CODE = 60    -- longest code line (characters) for side by side
local MAX_OUTPUT = 40  -- longest output line (characters) for side by side
local MAX_TOTAL = 80   -- the two together must still fit across the page

local function longest(text)
  local n = 0
  for line in (text .. "\n"):gmatch("(.-)\n") do
    n = math.max(n, utf8.len(line) or #line)
  end
  return n
end

local function is_output(block)
  return block ~= nil and block.t == "CodeBlock" and block.classes:includes("output")
end

function Blocks(blocks)
  local result = pandoc.Blocks{}
  local i = 1
  while i <= #blocks do
    local code, output = blocks[i], blocks[i + 1]
    if code.t == "CodeBlock" and not is_output(code) and is_output(output) then
      local classes = {"pair"}
      local c, o = longest(code.text), longest(output.text)
      if c <= MAX_CODE and o <= MAX_OUTPUT and c + o <= MAX_TOTAL then
        table.insert(classes, "side")
      end
      result:insert(pandoc.Div({code, output}, pandoc.Attr("", classes)))
      i = i + 2
    else
      result:insert(code)
      i = i + 1
    end
  end
  return result
end
