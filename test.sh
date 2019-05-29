#!/bin/bash
echo $0 $1 $2
while getopts ":a:bc:" opt
do
case $opt in
  a) 
  echo "a: $OPTARG $OPTIND";;
  b)
  echo "b: $OPTIND";;
  c)
  echo "c: $OPTIND";;
  ?)
  echo "error"
  exit 1;;
esac
done
echo $OPTIND
shift $(( $OPTIND-1 ))
echo $0
echo $*
