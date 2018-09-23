Rails.application.routes.draw do
  get  'home/index'
  get  '/delete_user', 			to:  'home#delete_user'
  root 'home#index'
end
