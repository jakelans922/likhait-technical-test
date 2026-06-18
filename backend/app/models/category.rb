class Category < ApplicationRecord
  # A category can be used by many expenses.
  has_many :expenses, dependent: :destroy

  # Category names must be present and unique, regardless of letter casing.
  validates :name, presence: true, uniqueness: { case_sensitive: false }
end
