# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Drawer component (Root)
    # Handles main component logic and data attributes for Vaul drawer
    module UI::DrawerBehavior
      # Generate data attributes for Stimulus controller
      def drawer_data_attributes
        attrs = {
          controller: "ui--drawer",
          ui__drawer_open_value: @open,
          ui__drawer_direction_value: @direction,
          ui__drawer_dismissible_value: @dismissible,
          ui__drawer_modal_value: @modal
        }

        # Add snap points if provided
        if @snap_points && !@snap_points.empty?
          attrs[:ui__drawer_snap_points_value] = @snap_points.to_json
          attrs[:ui__drawer_active_snap_point_value] = @active_snap_point || -1
          attrs[:ui__drawer_fade_from_index_value] = @fade_from_index || (@snap_points.length - 1)
          attrs[:ui__drawer_snap_to_sequential_point_value] = @snap_to_sequential_point if @snap_to_sequential_point
        end

        # Add advanced options
        attrs[:ui__drawer_handle_only_value] = @handle_only if @handle_only
        attrs[:ui__drawer_reposition_inputs_value] = @reposition_inputs if @reposition_inputs == false

        attrs
      end

      # Merge user-provided data attributes
      def merged_drawer_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(drawer_data_attributes)
      end

      # Build complete HTML attributes hash
      def drawer_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: drawer_classes,
          data: merged_drawer_data_attributes
        )
      end

      # Base CSS classes
      def drawer_base_classes
        ""
      end

      # Generate final classes using TailwindMerge
      def drawer_classes
        TailwindMerge::Merger.new.merge([drawer_base_classes, @classes].compact.join(" "))
      end
    end
