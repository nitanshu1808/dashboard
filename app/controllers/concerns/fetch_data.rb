module FetchData
  extend ActiveSupport::Concern
  # fetching data from user webservices

  def users_info
    url = ENDPOINT["base_url"] + ENDPOINT["users"]
    get_response(url)
  end

  def get_response(url)
    puts(url) if Rails.env.development?
    begin
      response = RestClient.get url, {:params => api_params}
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

  def api_params
    {}
  end
end
