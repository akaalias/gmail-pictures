Rails.application.routes.draw do
  scope '/api' do
    scope '/v1' do
      scope '/gifs' do
        get '/' => 'gifs#index'
        scope '/:id' do
          get '/' => 'gifs#show'
        end
      end
      scope '/users' do
        post '/' => 'users#create'
      end
    end
  end
end
