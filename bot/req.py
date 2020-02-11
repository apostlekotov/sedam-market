# -*- coding: utf-8 -*-
import config
import requests
import json
import time
import jwt

url = config.URL

# authorization middleware
def auth(fn):
  def set_token(m = False, call = False, id = False, token = ''):
    kwargs = {}

    if m:
      cid = m.chat.id
    elif call:
      cid = call.message.chat.id

    if m:
      kwargs['m'] = m
    if call:
      kwargs['call'] = call
    if id:
      kwargs['id'] = id

    payload = {
      'userId': cid,
      'iat': int(time.time()),
      'exp': int(time.time()) + 3600
    }
    token = jwt.encode( payload, config.JWT_SECRET ) # encode user id into token
  
    kwargs['token'] = token
    
    fn(**kwargs) # wrapped function go here with all variables

  return set_token

# GET /auth/users with token
def get_all_users(token):
  try:
    return requests.get( url + '/auth/users', headers = { 'Authorization': token } ).json()

  except Exception as e: 
    print(repr(e))
    return { 'success': False }

# POST /auth/register with token and data
def register(id, name, token):
  try:
    headers = { 
      'Content-Type': 'application/json', 
      'Authorization': token 
    }

    data = {
      'userId': id,
      'userName': name
    }

    return requests.post( url + '/auth/register', headers = headers, json = data ).json()

  except Exception as e: 
    print(repr(e))
    return { 'success': False }
    
# DELETE /auth/users/:id with token
def delete_user(id, token):
  try:
    headers = { 
      'Content-Type': 'application/json', 
      'Authorization': token 
    }

    return requests.delete( url + '/auth/users/' + id, headers = headers ).json()
  except Exception as e: 
    print(repr(e))
    return { 'success': False }

# GET /sales
def get_all_sales():
  try:
    return requests.get( url + '/sales' ).json()
 
  except Exception as e: 
    print(repr(e))
    return { 'success': False }

# GET /sales/:id with products 
def get_single_sale(id):
  try:
    sale = requests.get( url + '/sales/' + id ).json()
    products = requests.get( url + '/sales/' + id + '/products' ).json()

    if sale['success'] and products['success']: # into the one object (if api dev is stupid..)
      res = sale['data']
      res['products'] = products['data']
      res['success'] = True

      return res
    else:
      return { 'success': False }
 
  except Exception as e: 
    print(repr(e))
    return { 'success': False }

# POST /sales with token
def create_sale_event(fields, token):
  try:
    headers = { 
      'Content-Type': 'application/json', 
      'Authorization': token 
    }

    data = {
      'name': fields['name'],
      'description': fields['desc'],
      'period': fields['period']
    }

    return requests.post( url + '/sales', headers = headers, json = data ).json()

  except Exception as e: 
    print(repr(e))
    return { 'success': False }

# PUT /sales/:id with token
def update_sale_photo(fields, token):
  try:
    headers = { 
      'Content-Type': 'application/json', 
      'Authorization': token 
    }

    data = {
      'photo': fields['photo']
    }

    return requests.put( url + '/sales/' + fields['id'], headers = headers, json = data ).json()

  except Exception as e: 
    print(repr(e))
    return { 'success': False }

# DELETE /sales/:id with token
def delete_sale(id, token):
  try:
    headers = { 
      'Content-Type': 'application/json', 
      'Authorization': token 
    }

    return requests.delete( url + '/sales/' + id, headers = headers ).json()
  except Exception as e: 
    print(repr(e))
    return { 'success': False }

# GET /products/:id
def get_single_product(id):
  try:
    return requests.get( url + '/products/' + id ).json()

  except Exception as e: 
    print(repr(e))
    return { 'success': False }

# POST /sales/id/products with token
def add_product(fields, token):
  try:
    headers = { 
      'Content-Type': 'application/json', 
      'Authorization': token 
    }

    data = {
      'name': fields['name'],
      'salePrice': fields['salePrice'],
      'price': fields['price']
    }

    return requests.post( url + '/sales/' + fields['sale'] + '/products', headers = headers, json = data ).json()

  except Exception as e: 
    print(repr(e))
    return { 'success': False }

# PUT /products/:id with token
def update_product_photo(fields, token):
  try:
    headers = { 
      'Content-Type': 'application/json', 
      'Authorization': token 
    }

    data = {
      'photo': fields['photo']
    }

    return requests.put( url + '/products/' + fields['id'], headers = headers, json = data ).json()

  except Exception as e: 
    print(repr(e))
    return { 'success': False }

# DELETE /products/:id with token
def delete_product(id, token):
  try:
    headers = { 
      'Content-Type': 'application/json', 
      'Authorization': token 
    }

    return requests.delete( url + '/products/' + id, headers = headers ).json()
  except Exception as e: 
    print(repr(e))
    return { 'success': False }
