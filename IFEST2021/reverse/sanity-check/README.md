# FLAG
`IFEST2021{ch3ck_ch3ck_4nd_23ch3ck}`

# Kategori
Easy

# Description
STOP! This is a sanity checkpoint!

# Compile 
`$ gcc -Wall -s -o sanity -x c ./sanity.c`

# Solver
```
import angr
import claripy

target = angr.Project("./sanity", load_options={'auto_load_libs': False})
succ = 0x1712 + target.loader.main_object.min_addr
fail = 0x173B + target.loader.main_object.min_addr
argv1 = claripy.BVS("argv1", 34*8)
initial_state = target.factory.entry_state(args=["./sanity", argv1])
sm = target.factory.simulation_manager(initial_state)
sm.explore(start=initial_state,find=(succ,),avoid=(fail,))
print(sm.found[0].solver.eval(argv1, cast_to=bytes))
```