# -*- coding: utf-8 -*-
from os import path, remove
import config
import req
import telebot
from telebot import types

bot = telebot.TeleBot(config.TOKEN)

# easy btn generator function
def create_btn(text_btn, call_btn):
  return types.InlineKeyboardButton( text_btn, callback_data = call_btn )

# download photo and return url
def download_photo(m, id, prefix):
  file_name = m.document.file_name
  file_id_info = bot.get_file(m.document.file_id)
  downloaded_file = bot.download_file(file_id_info.file_path)
  photo = '/img/sales/{}_{}.{}'.format(prefix, id, file_name.split('.')[-1])

  full_path = config.PUBLIC_PATH + photo

  if (path.exists(full_path)):
    remove(full_path)

  with open(full_path, 'wb') as f:
    f.write(downloaded_file)

  return photo

# menu btns
def menu_murkup():
  menu = types.InlineKeyboardMarkup()
  menu.row( create_btn( 'Акційні події 🛒', 'sales' ), create_btn( 'Користувачі 👤', 'users' ) )
  return menu

# cancel btn
def cancel_murkup():
  cancel = types.InlineKeyboardMarkup()
  cancel.add( create_btn( 'Відмінити ❌', 'cancel' ) )
  return cancel

# get all sale events in menu
def all_sales(m):
  try:
    res = req.get_all_sales()

    if res['success']:
      markup = types.InlineKeyboardMarkup()

      for event in res['data']:
        call_btn = 'find_sale_' + event['id']
        btn = create_btn( event['name'], call_btn )
        markup.add(btn)

      btn_menu = create_btn('◀️ Меню', 'menu')
      btn_create_sale = create_btn('Створити подію ➕', 'create_sale')

      markup.add( btn_menu, btn_create_sale )

      bot.edit_message_text( chat_id = m.chat.id, message_id = m.message_id, text = m.text, reply_markup = markup )

    else:
      bot.send_message( m.chat.id, 'Помилка сервера, повторіть пізніше 😞' )
      
  except Exception as e:
    print(repr(e))

# get sale event by id
def single_sale(m, id):
  try:
    markup = types.InlineKeyboardMarkup()

    res = req.get_single_sale(id) # get sale event by id 

    if res['success']:       
      # send sale image
      try:
        img = open( config.PUBLIC_PATH + '/img/sales/sale_' + id + '.jpg' , 'rb' )
      except IOError:
        img = open( config.PUBLIC_PATH + '/img/sales/default-sale-img.jpg' , 'rb' ) 

      # sale event description here
      name = res['name'].encode('utf-8')
      desc = res['description'].encode('utf-8')
      period = res['period']

      text = '*{}*\n\n{}\n\n_{}_'.format( name, desc, period )

      # its products in buttons
      if res['products']:
        for product in res['products']:
          call_btn = 'find_product_' + product['id']
          btn = create_btn( product['name'], call_btn )
          markup.add(btn)

      # actions to sale event
      btn_load_img = create_btn( 'Змінити фото 🖼', 'change_img_sale_' + id )
      btn_delete = create_btn( 'Видалити ❌', 'delete_sale_' + id )
      btn_add_product = create_btn( 'Додати продукт 🛒', 'add_product_' + id )
      
      markup.row( btn_load_img, btn_delete )
      markup.add( btn_add_product )

      bot.send_photo( m.chat.id, photo = img, caption = text, parse_mode = 'Markdown', reply_markup = markup )
      
    else:
      bot.send_message( m.chat.id, 'Помилка сервера, повторіть пізніше 😞' )

  except Exception as e:
    print(repr(e))

# create sale event
def create_sale(m):
  msg = bot.send_message( m.chat.id, '🤖 Для створення нової акційної події надішліть мені повідомлення по формі:\n\n*Назва події*\nОпис (до 500 символів)\nДата події (dd.mm.yyyy - dd.mm.yyyy)', parse_mode = 'Markdown', reply_markup = cancel_murkup() )
  bot.register_next_step_handler( msg, next_create_sale )

# handle create event request
@req.auth
def next_create_sale(m, token = ''):
  try:
    try:
      form = m.text.split('\n') # get info from message 
    except IndexError:
      bot.send_message( m.chat.id, '🤖 Будь-ласка, дотримуйтесь формі' )

    if len(form) == 3:
      fields = {
        'name': form[0].encode('utf-8'),
        'desc': form[1].encode('utf-8'),
        'period': form[2].encode('utf-8')
      } 

      res = req.create_sale_event(fields, token)

      if res['success']:
        single_sale(m, res['data']['_id']) # show what you create

      elif res['error']:
        err_msg = '\n'.join( res['error'].encode('utf-8').split(',')[::-1] ) # complex validation error message
        bot.send_message( m.chat.id, err_msg )

      else:
        bot.send_message( m.chat.id, 'Помилка сервера, повторіть ще раз 😞' )

    else:
      bot.send_message( m.chat.id, '🤖 Будь-ласка, дотримуйтесь формі' )

  except Exception as e:
    print(repr(e))

# change sale's photo
def change_img_sale(m, id):
  msg = bot.send_message( m.chat.id, '🤖 Надішліть документ з фото (.jpg) для акційної події', parse_mode = 'Markdown', reply_markup = cancel_murkup() )
  bot.register_next_step_handler(msg, next_change_img_sale, id = id)

# handle image
@bot.message_handler(content_types=['document'])
@req.auth
def next_change_img_sale(m, id, token = ''):
  try:
    photo = download_photo(m, id, 'sale')

    fields = {
      'id': id,
      'photo': photo
    } 

    res = req.update_sale_photo(fields, token)

    if res['success']:
      single_sale(m, res['data']['_id']) # show what you update
    elif res['error']:
      err_msg = '\n'.join( res['error'].encode('utf-8').split(',')[::-1] ) # complex validation error message
      bot.send_message( m.chat.id, err_msg )
    else:
      bot.send_message( m.chat.id, 'Помилка сервера, повторіть пізніше 😞' )

  except Exception as e:
    print(repr(e))

# delete sale event with btn
@req.auth
def delete_sale(call, id, token = ''):
  try:
    res = req.delete_sale(id, token) 

    if res['success']:
      bot.answer_callback_query( call.id, 'Успішно видалено ✅', show_alert = True ) # fancy alert
      bot.delete_message( call.message.chat.id, call.message.message_id )

    elif res['error']:
      bot.answer_callback_query( call.id, res['error'].encode('utf-8'), show_alert = True )

    else:
      bot.answer_callback_query( call.id, 'Помилка сервера, повторіть пізніше', show_alert = True )

  except Exception as e:
    print(repr(e))

# get product by id
def single_product(m, id):
  try:
    res = req.get_single_product(id) # get sale event by id 
    markup = types.InlineKeyboardMarkup()

    if res['success']:
      product = res['data']

      # send product image
      try:
        img = open( config.PUBLIC_PATH + '/img/sales/' + product['photo'].split('/')[-1], 'rb' )
      except IOError:
        img = open( config.PUBLIC_PATH + '/img/sales/default-product-img.png' , 'rb' ) 

      # product description here
      name = product['name'].encode('utf-8')
      salePrice = product['salePrice']
      price = product['price']

      text = '*{}* \n\nЦіна: _{} грн, ({} грн)_'.format( name, salePrice, price )

      # actions to product
      btn_load_img = create_btn( 'Змінити фото 🖼', 'change_img_product_' + id )
      btn_delete = create_btn( 'Видалити ❌', 'delete_product_' + id )
      
      markup.row( btn_load_img, btn_delete )

      bot.send_photo( m.chat.id, photo = img, caption = text, parse_mode = 'Markdown', reply_markup = markup )
    else:
      bot.send_message( m.chat.id, 'Помилка сервера, повторіть пізніше 😞' )

  except Exception as e:
    print(repr(e))

# add product to the sale 
def add_product(m, id):
  msg = bot.send_message( m.chat.id, '🤖 Для створення нового акційного продукта для події надішліть мені повідомлення по формі:\n\n*Назва продукта*\nАкційна ціна (наприклад: 19.99)\nПочаткова ціна (наприклад: 21.56)\n\n', parse_mode = 'Markdown', reply_markup = cancel_murkup() )
  bot.register_next_step_handler(msg, next_add_product, id = id)

# handle add event request
@req.auth
def next_add_product(m, id, token = ''):
  try:
    try:
      form = m.text.split('\n') # get info from message 
    except IndexError:
      bot.send_message( m.chat.id, '🤖 Будь-ласка, дотримуйтесь формі' )
    
    if len(form) == 3:
      fields = {
        'sale': id,
        'name': form[0].encode('utf-8'),
        'salePrice': form[1].encode('utf-8'),
        'price': form[2].encode('utf-8')
      } 

      res = req.add_product(fields, token)

      if res['success']:
        single_product(m, res['data']['_id']) # show what you create

      elif res['error']:
        err_msg = '\n'.join( res['error'].encode('utf-8').split(',')[::-1] ) # complex validation error message
        bot.send_message( m.chat.id, err_msg )

      else:
        bot.send_message( m.chat.id, 'Помилка сервера, повторіть пізніше 😞' )

    else:
      bot.send_message( m.chat.id, '🤖 Будь-ласка, дотримуйтесь формі' )

  except Exception as e:
    print(repr(e))

# change product's photo
def change_img_product(m, id):
  msg = bot.send_message( m.chat.id, '🤖 Надішліть документ з фото (.png) для акційного продукта', parse_mode = 'Markdown', reply_markup = cancel_murkup() )
  bot.register_next_step_handler(msg, next_change_img_product, id = id)

# handle image
@bot.message_handler(content_types=['document'])
@req.auth
def next_change_img_product(m, id, token = ''):
  try:
    photo = download_photo(m, id, 'product')

    fields = {
      'id': id,
      'photo': photo
    } 

    res = req.update_product_photo(fields, token)

    if res['success']:
      single_product(m, res['data']['_id']) # show what you update
    elif res['error']:
      err_msg = '\n'.join( res['error'].encode('utf-8').split(',')[::-1] ) # complex validation error message
      bot.send_message( m.chat.id, err_msg )
    else:
      bot.send_message( m.chat.id, 'Помилка сервера, повторіть пізніше 😞' )

  except Exception as e:
    print(repr(e))

# delete product with btn
@req.auth
def delete_product(call, id, token = ''):
  try:
    res = req.delete_product(id, token) 

    if res['success']:
      bot.answer_callback_query( call.id, 'Успішно видалено ✅', show_alert = True ) # fancy alert
      bot.delete_message( call.message.chat.id, call.message.message_id )

    elif res['error']:
      bot.answer_callback_query( call.id, res['error'].encode('utf-8'), show_alert = True )

    else:
      bot.answer_callback_query( call.id, 'Помилка сервера, повторіть пізніше', show_alert = True )

  except Exception as e:
    print(repr(e))

# user menu
@req.auth
def users(m, token = '' ):
  try:
    res = req.get_all_users(token) # for btns to delete
    
    if res['success']:
      markup = types.InlineKeyboardMarkup()

      for user in res['data']:
        btn_user = create_btn( user['userName'], 'empty' )
        btn_delete = create_btn( '❌', 'delete_user_' + user['_id'] )

        if str(m.chat.id) == user['userId']:
          markup.add( btn_user )
        else:
          markup.row( btn_user, btn_delete )
      
      markup.add( create_btn( 'Додати користувача ➕', 'register') ) # add a new user (see register)
      markup.add( create_btn('◀️ Меню', 'menu') ) 
      
      bot.edit_message_text( chat_id = m.chat.id, message_id = m.message_id, text = m.text, reply_markup = markup )

    elif res['error']:
      bot.send_message( m.chat.id, res['error'].encode('utf-8') )

    else:
      bot.send_message( m.chat.id, 'Помилка сервера, повторіть пізніше 😞' )

  except Exception as e:
    print(repr(e))

# register a new user
def register(m):
  msg = bot.send_message( m.chat.id, '🤖 Для реєстрації нового користувача, надішліть мені будь-яке його повідомлення щоб я зміг сканувати його', reply_markup = cancel_murkup() )
  bot.register_next_step_handler(msg, next_register)

# handle forward message
@req.auth
def next_register(m, token = ''):
  try:
    fromUser = m.forward_from
    
    if fromUser:
      userId = fromUser.id

      if fromUser.username:
        userName = fromUser.username
      else:
        userName = fromUser.first_name.encode('utf-8') + ' ' + fromUser.last_name.encode('utf-8')

      res = req.register( str(userId), userName, token )

      if res['success']:
        bot.send_message( m.chat.id, 'Заєрестровано ✅\n\n{}: {}'.format(userId, userName) )
        
      elif res['error']:
        bot.send_message( m.chat.id, res['error'].encode('utf-8') ) # for validation

      else:
        bot.send_message( m.chat.id, 'Помилка сервера, повторіть пізніше 😞' )

    else:
      bot.register_next_step_handler( bot.send_message( m.chat.id, '🤖 Будь-ласка, перешліть повідомлення' ), next_register )

  except Exception as e:
    bot.register_next_step_handler( bot.send_message( m.chat.id, 'Помилка, спробуйте ще раз 😞' ), next_register )
    print(repr(e))

# delete user with btn
@req.auth
def delete_user(call, id, token = ''):
  try:
    m = call.message
    res = req.delete_user(id, token) # make a request to delete the user

    if res['success']:
      users = req.get_all_users(token) # another menu message with updated data
  
      if users['success']:
        markup = types.InlineKeyboardMarkup()

        for user in users['data']:
          btn_user = create_btn( user['userName'], 'empty' )
          btn_delete= create_btn( '❌', 'delete_user_' + user['_id'] )
        
          if str(m.chat.id) == user['userId']:
            markup.add( btn_user )
          else:
            markup.row( btn_user, btn_delete )
      
        markup.add( create_btn( 'Додати користувача ➕', 'register') ) # add a new user (see register)
        markup.add( create_btn('◀️ Меню', 'menu') ) 

        bot.edit_message_text( chat_id = m.chat.id, message_id = m.message_id, text = m.text, reply_markup = markup )

      else:
        bot.answer_callback_query( call.id, 'Помилка сервера, повторіть пізніше 😞', show_alert = True )

    elif res['error']:
      bot.answer_callback_query( call.id, res['error'].encode('utf-8'), show_alert = True )

    else:
      bot.answer_callback_query( call.id, 'Помилка сервера, повторіть пізніше', show_alert = True )
    
  except Exception as e:
    print(repr(e))

# start page with menu
@bot.message_handler(commands = [ 'start', 'menu' ])
def start(m):
  text = 'Вас вітає *SedamMarketBot* 🍅\n\nКористуватись можуть лише обранні. Тому якщо у Вас є до мене доступ, то Ви можете реєструвати нових користувачів, створювати нові акційні події та додвати до них продукти з акційними цінами!🛒\n\nПриємного користування 🤖'
    
  bot.send_message( m.chat.id, text, parse_mode = 'Markdown', reply_markup = menu_murkup() )

# callback from btns
@bot.callback_query_handler(func = lambda call: True)
def callback_query(call):
  try:
    if call.message:
      if call.data == 'menu':
        bot.edit_message_text( chat_id = call.message.chat.id, message_id = call.message.message_id, text = call.message.text, reply_markup = menu_murkup() )
        bot.answer_callback_query( call.id, '' )
      
      elif call.data == 'cancel':
        bot.clear_step_handler_by_chat_id( call.message.chat.id )
        bot.delete_message( call.message.chat.id, call.message.message_id )
        bot.answer_callback_query( call.id, '' )

      # sale commands
      elif call.data == 'sales':
        bot.answer_callback_query( call.id, '' )
        all_sales( m = call.message )

      elif call.data.startswith('find_sale_'): # and ends with id
        bot.send_chat_action( call.message.chat.id, 'typing' )
        single_sale( m = call.message, id = call.data.split('_')[-1])
        bot.answer_callback_query( call.id, '' )
      
      elif call.data == 'create_sale':
        create_sale( m = call.message )
        bot.answer_callback_query( call.id, '' )
      
      elif call.data.startswith('change_img_sale_'): # and ends with id
        bot.send_chat_action(call.message.chat.id, 'typing')
        change_img_sale( m = call.message, id = call.data.split('_')[-1] )
        bot.answer_callback_query(call.id, '')

      elif call.data.startswith('delete_sale_'): # and ends with id
        delete_sale( call = call, id = call.data.split('_')[-1] )

      # product commands
      elif call.data.startswith('find_product_'): # and ends with id
        bot.send_chat_action( call.message.chat.id, 'typing' )
        single_product( m = call.message, id = call.data.split('_')[-1])
        bot.answer_callback_query( call.id, '' )

      elif call.data.startswith('add_product_'): # and ends with sale id
        bot.send_chat_action( call.message.chat.id, 'typing' )
        add_product( m = call.message, id = call.data.split('_')[-1])
        bot.answer_callback_query( call.id, '' )

      elif call.data.startswith('change_img_product_'): # and ends with id
        bot.send_chat_action( call.message.chat.id, 'typing' )
        change_img_product( m = call.message, id = call.data.split('_')[-1] )
        bot.answer_callback_query( call.id, '' )
        
      elif call.data.startswith('delete_product_'): # and ends with id
        delete_product( call = call, id  = call.data.split('_')[-1] )

      # admins commands
      elif call.data == 'users':
        users( m = call.message )
        bot.answer_callback_query( call.id, '' )

      elif call.data == 'register':
        bot.send_chat_action( call.message.chat.id, 'typing' )
        register( m = call.message )
        bot.answer_callback_query( call.id, '' )

      elif call.data.startswith('delete_user_'): # and ends with id
        delete_user( call = call, id = call.data.split('_')[-1] )

  except Exception as e:
    print(repr(e))

bot.polling(none_stop = True)