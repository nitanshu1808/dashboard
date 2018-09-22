module HomeHelper
  def date_format( date )
    date.to_date.strftime("%Y-%m-%d")
  end

  def sub_domain( data )
    data.map{|user| user['email'].split('@')[1]}.uniq
  end

  def characters_group
    [ "A - E",
      "F - Z",
      "K - O",
      "P - T",
      "U - Z"
    ]
  end

  def pagination
    @response["total_pages"] > 1
  end

  def pagination_links
    for i in (1..@response["total_pages"]) do
      break if i == 5 || i == @response["total_pages"]
      concat(content_tag(:li, create_links(i)))
    end
  end

  def create_links( val )
    content_tag(:a, href: "javascript:void(0)") do link_text(val) end
  end

  def link_text(val)
    case val
    when 1
      I18n.t("app.first")
    when @response["total_pages"]
      I18n.t("app.last")
    when 2
      I18n.t("app.next")
    when 3
      I18n.t("app.prev")
    when 4
      I18n.t("app.last")
    end
  end
end
