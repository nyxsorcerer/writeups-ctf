import re
try:
    bad = bool(re.search(r'[^a-z\s]', (input := input(">> "))))
    exec(input) if not bad else print('Hahaha No!')
    exit(bad)
except:
    exit("HAHAHA you breaking the jail")