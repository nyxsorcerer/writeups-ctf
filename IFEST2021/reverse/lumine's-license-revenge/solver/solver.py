import string as st, os, struct
'''
	~ Sorry if its really messy and buggy >_< ~

    another way no need a debug ./application 
        $ while true; do cp /tmp/*.so checker.so;done
	1. get crc_table first // uncomment get_crc_table()
	2. get license value // get_license()

	$ go build solv.go
	$ gdb -q -x solv.py
'''

# IFEST2021{NOoOOoOOOo_didnt_i_tell_you_to_not_crackme?_;-;_uwu}

# def get_crc_table():
# 	import gdb 
# 	gdb.execute("set pagination off")
# 	gdb.execute('file checker.so')
# 	i = gdb.inferiors()[0]
# 	addr = 0x114E20
# 	end_addr = 0x115620
# 	crc = []
# 	x = 0
# 	while True:
# 		if (addr+x) == end_addr:
# 			break
# 		m = i.read_memory(addr+x, 8)
# 		x += 8
# 		crc.append(hex(struct.unpack('<Q', m.tobytes())[0]))
# 	print(crc)

license = []

def get_license():
	import gdb
	gdb.execute('file checker.so')
	for x in range(2, 64):
		license.append(eval(str(gdb.parse_and_eval(f"'main..stmp_{x}'")).replace("{", "[").replace("}", "]")))

get_license()


charset = st.ascii_letters + st.digits + "!@#$%^&*()-_;:?+{}"
flag = ""
for x in range(len(license)):
	for char in charset:
		a = [int(z, 16) for z in (os.popen(f'./solv "{char}"').read().replace("\n", "").split(" "))]
		if license[x] == a:
			flag += char
			break
	print(flag)