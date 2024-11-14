class SelectPreview < Lookbook::Preview
  def default
    render UI::Select.new do |s|
      s.trigger(class: "w-[280px]") do |t|
        t.value { "Select a timezone" }
      end

      s.content do |c|
        c.group do |g|
          g.label { "North America" }
          g.item(value: :est) { "Eastern Standard Time (EST)" }
          g.item(value: :cst) { "Central Standard Time (CST)" }
          g.item(value: :mst) { "Mountain Standard Time (MST)" }
          g.item(value: :pst) { "Pacific Standard Time (PST)" }
          g.item(value: :akst) { "Alaska Standard Time (AKST)" }
          g.item(value: :hst) { "Hawaii Standard Time (HST)" }
        end

        c.group do |g|
          g.label { "Europe & Africa" }
          g.item(value: :gmt) { "Greenwich Mean Time (GMT)" }
          g.item(value: :cet) { "Central European Time (CET)" }
          g.item(value: :eet) { "Eastern European Time (EET)" }
          g.item(value: :west) { "Western European Summer Time (WEST)" }
          g.item(value: :cat) { "Central Africa Time (CAT)" }
          g.item(value: :eat) { "East Africa Time (EAT)" }
        end

        c.group do |g|
          g.label { "Asia" }
          g.item(value: :msk) { "Moscow Time (MSK)" }
          g.item(value: :ist) { "India Standard Time (IST)" }
          g.item(value: :cst_china) { "China Standard Time (CST)" }
          g.item(value: :jst) { "Japan Standard Time (JST)" }
          g.item(value: :kst) { "Korea Standard Time (KST)" }
          g.item(value: :ist_indonesia) { "Indonesia Central Standard Time (WITA)" }
        end

        c.group do |g|
          g.label { "Australia & Pacific" }
          g.item(value: :awst) { "Australian Western Standard Time (AWST)" }
          g.item(value: :acst) { "Australian Central Standard Time (ACST)" }
          g.item(value: :aest) { "Australian Eastern Standard Time (AEST)" }
          g.item(value: :nzst) { "New Zealand Standard Time (NZST)" }
          g.item(value: :fjt) { "Fiji Time (FJT)" }
        end

        c.group do |g|
          g.label { "South America" }
          g.item(value: :art) { "Argentina Time (ART)" }
          g.item(value: :bot) { "Bolivia Time (BOT)" }
          g.item(value: :brt) { "Brasilia Time (BRT)" }
          g.item(value: :clt) { "Chile Standard Time (CLT)" }
        end
      end
    end
  end

  def checked
    render UI::Select.new(value: :brt) do |s|
      s.trigger(class: "w-[280px]") do |t|
        t.value { "Select a timezone" }
      end

      s.content do |c|
        c.group do |g|
          g.label { "North America" }
          g.item(value: :est) { "Eastern Standard Time (EST)" }
          g.item(value: :cst) { "Central Standard Time (CST)" }
          g.item(value: :mst) { "Mountain Standard Time (MST)" }
          g.item(value: :pst) { "Pacific Standard Time (PST)" }
          g.item(value: :akst) { "Alaska Standard Time (AKST)" }
          g.item(value: :hst) { "Hawaii Standard Time (HST)" }
        end

        c.group do |g|
          g.label { "Europe & Africa" }
          g.item(value: :gmt) { "Greenwich Mean Time (GMT)" }
          g.item(value: :cet) { "Central European Time (CET)" }
          g.item(value: :eet) { "Eastern European Time (EET)" }
          g.item(value: :west) { "Western European Summer Time (WEST)" }
          g.item(value: :cat) { "Central Africa Time (CAT)" }
          g.item(value: :eat) { "East Africa Time (EAT)" }
        end

        c.group do |g|
          g.label { "Asia" }
          g.item(value: :msk) { "Moscow Time (MSK)" }
          g.item(value: :ist) { "India Standard Time (IST)" }
          g.item(value: :cst_china) { "China Standard Time (CST)" }
          g.item(value: :jst) { "Japan Standard Time (JST)" }
          g.item(value: :kst) { "Korea Standard Time (KST)" }
          g.item(value: :ist_indonesia) { "Indonesia Central Standard Time (WITA)" }
        end

        c.group do |g|
          g.label { "Australia & Pacific" }
          g.item(value: :awst) { "Australian Western Standard Time (AWST)" }
          g.item(value: :acst) { "Australian Central Standard Time (ACST)" }
          g.item(value: :aest) { "Australian Eastern Standard Time (AEST)" }
          g.item(value: :nzst) { "New Zealand Standard Time (NZST)" }
          g.item(value: :fjt) { "Fiji Time (FJT)" }
        end

        c.group do |g|
          g.label { "South America" }
          g.item(value: :art) { "Argentina Time (ART)" }
          g.item(value: :bot) { "Bolivia Time (BOT)" }
          g.item(value: :brt) { "Brasilia Time (BRT)" }
          g.item(value: :clt) { "Chile Standard Time (CLT)" }
        end
      end
    end
  end
end
