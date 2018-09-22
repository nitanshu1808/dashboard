class HomeController < ApplicationController

  include FetchData

  def index
    @response = users_info
    @users    = @response['data']
  end
end
