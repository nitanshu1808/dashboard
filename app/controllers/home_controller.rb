class HomeController < ApplicationController

  include FetchResponse

  def index
    @response = users_info
    @users    = @response['data']
  end

  def delete_user
    respns = remove_user
    render json: {respns: respns}
  end

  def create_user
    @resps = construct_user
  end

end
