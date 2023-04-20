````bash
zip -rq my-function.zip *
aws lambda update-function-code --function-name freee01 --zip-file fileb://my-function.zip
````