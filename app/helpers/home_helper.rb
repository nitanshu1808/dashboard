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
    content_tag(:a, href: root_url({page: page_num(val), sort: params["sort"]}.compact ), "data-remote": true) do
      link_text(val)
    end
  end

  def link_text(val)
    case val
    when 1
      I18n.t("app.first")
    when @response["total_pages"], 4
      I18n.t("app.last")
    when 2
      I18n.t("app.next")
    when 3
      I18n.t("app.prev")
    end
  end

  def page_num(val)
    case val
    when 4
      @response["total_pages"]
    when I18n.t("app.next"), 2
      (params["page"] && params["page"].to_i + 1) || val
    when I18n.t("app.prev"), 3
      (params["page"] && params["page"].to_i > 1 && params["page"].to_i - 1) || nil
    else
      val
    end
  end

  def set_sort_btn_val
    params["sort"] ? I18n.t("app." + params["sort"]) : I18n.t("app.sort_by")
  end

end
