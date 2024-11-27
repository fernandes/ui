require "hashids"

module UI::IdGenerator
  def self.generate(salt)
    time = Time.now.to_f.to_s[8..-1].tr(".", "").to_i
    hashids = Hashids.new(salt)
    hashids.encode(time)
  end
end
