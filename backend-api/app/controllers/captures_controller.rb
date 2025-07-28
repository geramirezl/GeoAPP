class CapturesController < ApplicationController
    protect_from_forgery with: :null_session

    # POST /captures
    def create
        capture= Capture.new(capture_params)
        if capture.save
            render json: { message: "Capture saved successfully", capture: capture }, status: :created
        else
            render json: { errors: capture.errors.full_messages }, status: :unprocessable_entity
        end
    end


     # GET /captures?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
    def index
        captures = Capture.all

        # Filtrar por rango de fechas si se proveen parámetros
        if params[:start_date].present? && params[:end_date].present?
            begin
                start_date = Date.parse(params[:start_date])
                end_date = Date.parse(params[:end_date])
                captures = captures.where(captured_at: start_date.beginning_of_day..end_date.end_of_day)
            rescue ArgumentError
                return render json: { error: "Invalid date format" }, status: :bad_request
            end
        end

        render json: captures.order(captured_at: :desc)
    end

    private

    def capture_params
        params.require(:capture).permit(:latitude, :longitude, :captured_at, :device_brand, :device_model)
    end
end