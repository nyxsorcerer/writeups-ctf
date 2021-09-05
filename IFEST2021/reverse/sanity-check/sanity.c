/*
* Author    : nyxsorcerer
* FLAG      : IFEST2021{ch3ck_ch3ck_4nd_23ch3ck}
* $ gcc -Wall -s -o sanity -x c ./sanity.c
* 
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int check0(char *a1){
    if(strlen(a1) != 34){
        return 1;
    }
    return 0;
}

int check1(char *a1){        
    if( a1[0] != 'I' ) return 1;
    if( a1[1] != 'F' ) return 1;
    if( a1[2] != 'E' ) return 1;
    if( a1[3] != 'S' ) return 1;
    if( a1[4] != 'T' ) return 1;
    return 0;
}

int check2(char *a1){
    static int a[4] = {0x32, 0x30, 0x32, 0x31};
    int b, i;
    for (i = 0x05, b = 0; i < 0x09; i++, b++)
    {   
        if( a[b] != a1[i]){
            return 1;
        }
    }
    return 0;
}

int check3(char *a1){
    int i;
    static const int b[] = {15, 21, 25};
    for (i = 0; i < 3; i++)
    {
        if (0x5f != a1[b[i]]) return 1;
    }    
    return 0;
}

int check4(char *a1){
    if( ((a1[9] & 0xff)*5) != 615) return 1;
    if( ((a1[33] & 0xff)*5) != 625) return 1;
    return 0;
}

int check5(char *a1){
    if (0x32 != (a1[26])) return 1;
    return 0;  
}

int check6(char *a1){
    if( a1[10] != 'c') return 1;
    if( a1[13] != 'c') return 1;
    if( a1[16] != 'c') return 1;
    if( a1[19] != 'c') return 1;
    if( a1[28] != 'c') return 1;
    if( a1[31] != 'c') return 1;

    int i;
    static char a[2];
    int b[] = {12, 18, 27, 30};
    for (i = 0; i < 4; i++)
    {
        a[0] = a1[b[i]];
        a[1] = '\x00';
        if (0x03 != atol(a)) return 1;
    }

    b[0] = 11;
    b[1] = 17;
    b[2] = 29;
    for (i = 0; i < 3; i++)
    {        
        if ('h' != a1[b[i]]) return 1;
    }

    if( a1[14] != 'k') return 1;
    if( a1[20] != 'k') return 1;
    if( a1[32] != 'k') return 1;

    return 0;
}

int check7(char *a1){
    static int a[3] = {0x34, 0x6e, 0x64};
    int b, i;
    for (i = 0x16, b = 0; i < 0x19; i++, b++)
    {   
        if (a[b] != a1[i]) return 1;
    }
    return 0;
}


int main(int argc, char *argv[])
{
    if (argc < 2) {
        printf("%s IFEST2021{maybe_this_is_the_real_flag}\n", argv[0]);
        exit(1);
    }
    if (1 == check0(argv[1])) goto hell;
    if (1 == check1(argv[1])) goto hell;
    if (1 == check2(argv[1])) goto hell;
    if (1 == check3(argv[1])) goto hell;
    if (1 == check4(argv[1])) goto hell;
    if (1 == check5(argv[1])) goto hell;
    if (1 == check6(argv[1])) goto hell;
    if (1 == check7(argv[1])) goto hell;
    puts("You got the real flag!");
    return 69;
hell:
    puts("Give me the real flag!");
    return 1;
}