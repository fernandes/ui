module UI
  class CalendarController < ApplicationController
    skip_forgery_protection
    layout false

    def format
      date = Date.parse(params[:value])
      render json: {value: date.to_fs(:long_ordinal)}
    end

    def create
      render UI::Calendar.new(
        month: params[:month].to_i,
        year: params[:year].to_i,
        weeks: params[:weeks] || 6,
        active_day: params[:focused] || 1,
        jump_amount: params[:jump_amount],
        selected_value: params[:selected_value]
      )
    end
  end
end
