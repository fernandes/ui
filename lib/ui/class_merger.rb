# frozen_string_literal: true

module UI
  # Shared TailwindMerge entry point for every component.
  #
  # Building a TailwindMerge::Merger is expensive (it compiles the whole
  # Tailwind class map, ~4ms) while merging with an existing one is cheap and
  # cached. Creating one per component made each render pay that cost, so a
  # page with a few hundred components spent most of its time here.
  #
  # The merger's internal LRU cache is not thread-safe, so each thread keeps
  # its own instance. `thread_variable_*` is truly thread-local (unlike
  # `Thread.current[]`, which is per fiber), so fiber-based servers still reuse
  # one merger per thread; merging never yields, so fibers can't interleave.
  module ClassMerger
    KEY = :ui_tailwind_merger

    def self.merge(classes)
      merger.merge(classes)
    end

    def self.merger
      Thread.current.thread_variable_get(KEY) ||
        Thread.current.thread_variable_set(KEY, ::TailwindMerge::Merger.new)
    end
  end
end
