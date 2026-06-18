class Expense < ApplicationRecord
  # Every expense belongs to a category that is used for reporting.
  belongs_to :category

  # Expenses should not be recorded for future dates.
  validates :date, comparison: { less_than_or_equal_to: Date.current },
                   allow_nil: false
end
