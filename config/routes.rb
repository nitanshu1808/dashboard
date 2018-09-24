Rails.application.routes.draw do
  get  'home/index'

  get  '/delete_user', to: 'home#delete_user'

  post '/create_user', to: 'home#create_user'

  get  '/new_user',    to:  'home#new_user'

  # Root url of the application
  root 'home#index'
end
