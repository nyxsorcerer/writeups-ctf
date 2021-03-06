package main

// $ go build solv.go

import (
	"flag"
	"fmt"
	"math/rand"
	"os"
)

var crc_table = []int64{0x0, 0x2d, 0x5a, 0x77, 0xb4, 0x99, 0xee, 0xc3, 0x45, 0x68, 0x1f, 0x32, 0xf1, 0xdc, 0xab, 0x86, 0x8a, 0xa7, 0xd0, 0xfd, 0x3e, 0x13, 0x64, 0x49, 0xcf, 0xe2, 0x95, 0xb8, 0x7b, 0x56, 0x21, 0xc, 0x39, 0x14, 0x63, 0x4e, 0x8d, 0xa0, 0xd7, 0xfa, 0x7c, 0x51, 0x26, 0xb, 0xc8, 0xe5, 0x92, 0xbf, 0xb3, 0x9e, 0xe9, 0xc4, 0x7, 0x2a, 0x5d, 0x70, 0xf6, 0xdb, 0xac, 0x81, 0x42, 0x6f, 0x18, 0x35, 0x72, 0x5f, 0x28, 0x5, 0xc6, 0xeb, 0x9c, 0xb1, 0x37, 0x1a, 0x6d, 0x40, 0x83, 0xae, 0xd9, 0xf4, 0xf8, 0xd5, 0xa2, 0x8f, 0x4c, 0x61, 0x16, 0x3b, 0xbd, 0x90, 0xe7, 0xca, 0x9, 0x24, 0x53, 0x7e, 0x4b, 0x66, 0x11, 0x3c, 0xff, 0xd2, 0xa5, 0x88, 0xe, 0x23, 0x54, 0x79, 0xba, 0x97, 0xe0, 0xcd, 0xc1, 0xec, 0x9b, 0xb6, 0x75, 0x58, 0x2f, 0x2, 0x84, 0xa9, 0xde, 0xf3, 0x30, 0x1d, 0x6a, 0x47, 0xe4, 0xc9, 0xbe, 0x93, 0x50, 0x7d, 0xa, 0x27, 0xa1, 0x8c, 0xfb, 0xd6, 0x15, 0x38, 0x4f, 0x62, 0x6e, 0x43, 0x34, 0x19, 0xda, 0xf7, 0x80, 0xad, 0x2b, 0x6, 0x71, 0x5c, 0x9f, 0xb2, 0xc5, 0xe8, 0xdd, 0xf0, 0x87, 0xaa, 0x69, 0x44, 0x33, 0x1e, 0x98, 0xb5, 0xc2, 0xef, 0x2c, 0x1, 0x76, 0x5b, 0x57, 0x7a, 0xd, 0x20, 0xe3, 0xce, 0xb9, 0x94, 0x12, 0x3f, 0x48, 0x65, 0xa6, 0x8b, 0xfc, 0xd1, 0x96, 0xbb, 0xcc, 0xe1, 0x22, 0xf, 0x78, 0x55, 0xd3, 0xfe, 0x89, 0xa4, 0x67, 0x4a, 0x3d, 0x10, 0x1c, 0x31, 0x46, 0x6b, 0xa8, 0x85, 0xf2, 0xdf, 0x59, 0x74, 0x3, 0x2e, 0xed, 0xc0, 0xb7, 0x9a, 0xaf, 0x82, 0xf5, 0xd8, 0x1b, 0x36, 0x41, 0x6c, 0xea, 0xc7, 0xb0, 0x9d, 0x5e, 0x73, 0x4, 0x29, 0x25, 0x8, 0x7f, 0x52, 0x91, 0xbc, 0xcb, 0xe6, 0x60, 0x4d, 0x3a, 0x17, 0xd4, 0xf9, 0x8e, 0xa3}

func main() {
	flag.Parse()
	args := flag.Args()
	if len(args) < 1 {
		fmt.Println("args not enough")
		os.Exit(1)
	}
	for _, char := range args[0] {
		rand.Seed(crc_table[(char+0x7331)&0xff])

		// fmt.Printf("0x%x ", crc_table[(char+0x1337)&0xff])
		fmt.Printf("%x ", rand.Int())
		fmt.Printf("%x ", rand.Int())
		fmt.Printf("%x ", rand.Int())
		fmt.Printf("%x ", rand.Int())
		fmt.Printf("%x", rand.Int())
	}
	// fmt.Printf("opening %s\n", args[0])
}
