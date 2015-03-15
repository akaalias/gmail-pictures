class UsersController < ApplicationController

  skip_before_filter :verify_authenticity_token  

  def create

    email = params[:user][:email]
    password = params[:user][:password]
    
    user = User.new(email: email, password: password)
    
    if user.save
      render :json => user.as_json(exclude: [:email, :created_at, :updated_at]), :status => 201
      return
    else
      render :json => user.errors, :status => 422
    end
  end

  private
  def user_params
    params.require(:user).permit(:email, :password)
  end
end
