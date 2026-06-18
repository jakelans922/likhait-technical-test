class Api::CategoriesController < ApplicationController
  # Returns all categories in alphabetical order for the UI dropdowns.
  def index
    categories = Category.order(:name)
    render json: categories
  end

  # Creates a new category from the form modal.
  def create
    category = Category.new(category_params)

    if category.save
      render json: category, status: :created
    else
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Strong parameters for category creation.
  def category_params
    params.require(:category).permit(:name)
  end
end
