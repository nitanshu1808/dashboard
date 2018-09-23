module FetchResponse
  extend ActiveSupport::Concern
  # fetching response from user webservices for retreival, deletion, creation

  def users_info
    url = ENDPOINT["base_url"] + ENDPOINT["users"]
    get_response(url)
  end

  def get_response(url, additional_options={})
    request_type = additional_options[:request_type] || :get
    begin
      response = RestClient.public_send(request_type, url, {:params => api_params})
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

  def remove_user
    url = ENDPOINT["base_url"] + ENDPOINT["users"] + "/#{params["id"]}"
    get_response(url, {request_type: :delete})
  end

  # private methods
  private
  def api_params
    {page: params["page"], sort: params["sort"], filter: params["filter"]}.compact
  end
end
