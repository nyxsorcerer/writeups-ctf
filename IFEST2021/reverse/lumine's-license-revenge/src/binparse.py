


with open("liblicense.so", "rb") as fn:
    f = list(fn.read())
    fn.close()

y = []

# open("y", "w").writelines(str(f))
for x in f:
    y.append((x + 0x1337) ^ 0x80)
print(len(y))
open("x", "w").writelines(str(y))

