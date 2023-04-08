import os


#output file to write the result to
fout = open("/etc/nginx/nginx.conf", "wt")
fin = None

RP_BACKEND = os.environ.get('RP_BACKEND')
# ===========

try:
  RP_DOMAIN_NAME = os.environ.get('CERTBOT_DOMAIN')
  #print('ENV environment variable exists')
  # print('okkkkk nooooo', RP_DOMAIN_NAME)
  if RP_DOMAIN_NAME == None or RP_DOMAIN_NAME == '':
    raise Exception("CERTBOT_DOMAIN is not set")
  
  # sed -e 's/${RP_DOMAIN}/$CERTBOT_DOMAIN/g' -e 's/${RP_BACKEND}/$RP_BACKEND/g' /etc/nginx/nginx-https-template.conf  >> /etc/nginx/nginx.conf

  fin = open("/etc/nginx/nginx-https-template.conf", "rt")
  #for each line in the input file
  for line in fin:
    #read replace the string and write to output file
    line = line.replace('${RP_BACKEND}', RP_BACKEND)
    line = line.replace('${RP_DOMAIN_NAME}', RP_DOMAIN_NAME)
    fout.write(line)
except:
  #input file
  fin = open("/etc/nginx/nginx-http-template.conf", "rt")
  #for each line in the input file
  for line in fin:
    #read replace the string and write to output file
    fout.write(line.replace('${RP_BACKEND}', RP_BACKEND))
  #close input and output files

# ===========

fin.close()
fout.close()
# print(f'Currently working in {env_var} environment')