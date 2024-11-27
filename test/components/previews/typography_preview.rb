class TypographyPreview < Lookbook::Preview
  def h1
    render UI.h1 { "Taxing Laughter: The Joke Tax Chronicles" }
  end

  def h2
    render UI.h2 { "The People of the Kingdom" }
  end

  def h3
    render UI.h3 { "The Joke Tax" }
  end

  def h4
    render UI.h4 { "People stopped telling jokes" }
  end

  def p
    render UI.p { "The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax." }
  end

  def blockquote
    render UI.blockquote { '"After all," he said, "everyone enjoys a good joke, so it\'s only fair that they should pay for the privilege."' }
  end

  def list
    render UI.ul do |ul|
      ul.li { "1st level of puns: 5 gold coins" }
      ul.li { "2nd level of jokes: 10 gold coins" }
      ul.li { "3rd level of one-liners : 20 gold coins" }
    end
  end

  def code
    render UI.code { "@radix-ui/react-alert-dialog" }
  end

  def lead
    render UI.lead { "A modal dialog that interrupts the user with important content and expects a response." }
  end

  def large
    render UI.large { "Are you absolutely sure?" }
  end

  def small
    render UI.small { "Email address" }
  end

  def muted
    render UI.muted { "Enter your email address." }
  end
end
