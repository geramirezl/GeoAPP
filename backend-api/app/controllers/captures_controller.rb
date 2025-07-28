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
                # Parsear las fechas en zona horaria de Bogotá
                bogota_tz = ActiveSupport::TimeZone.new('America/Bogota')
                start_date = bogota_tz.parse("#{params[:start_date]} 00:00:00")
                end_date = bogota_tz.parse("#{params[:end_date]} 23:59:59")
                
                # Convertir a UTC para la consulta en base de datos
                start_utc = start_date.utc
                end_utc = end_date.utc
                
                captures = captures.where(captured_at: start_utc..end_utc)
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