module FetchResponse
  extend ActiveSupport::Concern
  # fetching response from user webservices for retreival, deletion, creation

  def users_info
    get_response(base_url, {request_type: :get}, api_params )
  end

  def remove_user
    url = base_url + "/#{params["id"]}"
    get_response(url, {request_type: :delete}, {})
  end

  def construct_user
    get_response(base_url, {request_type: :post}, user_params)
  end

  # private methods
  private
  def api_params
    {:params => {page: params["page"], sort: params["sort"], filter: params["filter"]}.compact}
  end

  def user_params
    {:user => params.require(:user).permit(:email, :first_name, :last_name, :amount).to_h}
  end

  def get_response(url, additional_options={}, parameters)
    request_type = additional_options[:request_type] || :get
    begin
      response = RestClient.public_send(request_type, url, parameters)
      JSON.parse(response)
    rescue RestClient::Unauthorized => error
      retries ||= 0
      if retries == 0
        retries = 1
        retry
      else
        raise error
      end
    end
  end

  def base_url
    ENDPOINT["base_url"] + ENDPOINT["users"]
  end
end
