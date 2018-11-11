#!/bin/bash

if [ "$#" -lt 2 ]
then
  echo "Supply server root (-r), address (-a) or key+cert (-k)"
else

  if [ "$#" -lt 4 ]
  then
    echo "banana";
    SERVER_ROOT=$1
    ADDRESS=$2
    if [ "$#" -eq 3 ]
    then
      SSL_ROOT=$3
    fi
  else
    while getopts r:a:k: option
    do
      case "${option}"
      in
      r) SERVER_ROOT=${OPTARG};;
      a) ADDRESS=${OPTARG};;
      k) SSL_ROOT=${OPTARG};;
      esac
    done
  fi

  PORT=8443

  if [ -z ${SSL_ROOT+x} ]
  then
    DISTRIBUTION=${SERVER_ROOT}/dist/PotholeDetectionWebApp
    CERT=${SERVER_ROOT}/ssl/server.crt
    KEY=${SERVER_ROOT}/ssl/server.key
  else
    CERT=${SSL_ROOT}/server.crt
    KEY=${SSL_ROOT}/server.key
    DISTRIBUTION=${SERVER_ROOT}
  fi
#   SERVER_ROOT=$1
#   ADDRESS=$2
#   DISTRIBUTION=${SERVER_ROOT}/dist/PotholeDetectionWebApp
#   CERT=${SSL_ROOT}/server.crt
#   KEY=${SSL_ROOT}/server.key

  echo "http-server ${DISTRIBUTION} -p ${PORT} -a ${ADDRESS} --cors --ssl --cert ${CERT} --key ${KEY}"

  http-server ${DISTRIBUTION} -p ${PORT} -a ${ADDRESS} --cors --ssl --cert ${CERT} --key ${KEY}
fi



