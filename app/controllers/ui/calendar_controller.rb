module UI
  class CalendarController < ApplicationController
    skip_forgery_protection
    layout false

    def create
      render UI::Calendar.new(
        month: params[:month].to_i,
        year: params[:year].to_i,
        weeks: params[:weeks] || 6
      )
    end
  end
end
