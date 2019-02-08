import requests

url = "http://localhost:3000/url-service/shorten"

for x in range(74127,1000000	):
	payload = '{"url" : "https://www.shopclues.com/v11/order/' + str(x) + '"}'
	headers = {
    	'Content-Type': "application/json",
    	'cache-control': "no-cache",
    	'Postman-Token': "b219d779-a192-4743-8767-e86a546568d6"
    }

	response = requests.request("POST", url, data=payload, headers=headers)
	print(response.text)
