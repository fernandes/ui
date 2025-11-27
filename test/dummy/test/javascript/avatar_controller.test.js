import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import AvatarController from "../../../../app/javascript/ui/controllers/avatar_controller.js"

describe("AvatarController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--avatar", AvatarController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createAvatar(options = {}) {
    const { src = "https://example.com/image.jpg", showFallback = false } = options

    return `
      <div data-controller="ui--avatar" data-testid="avatar">
        <img data-ui--avatar-target="image"
             src="${src}"
             class="${showFallback ? 'hidden' : ''}"
             data-testid="image" />
        <span data-ui--avatar-target="fallback"
              class="${showFallback ? '' : 'hidden'}"
              data-testid="fallback">AB</span>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects successfully", async () => {
      container.innerHTML = createAvatar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="avatar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--avatar")

      expect(controller).not.toBeNull()
    })

    test("has image target", async () => {
      container.innerHTML = createAvatar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="avatar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--avatar")

      expect(controller.hasImageTarget).toBe(true)
    })

    test("has fallback target", async () => {
      container.innerHTML = createAvatar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="avatar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--avatar")

      expect(controller.hasFallbackTarget).toBe(true)
    })
  })

  describe("Image Loading", () => {
    test("shows image and hides fallback on load", async () => {
      container.innerHTML = createAvatar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="avatar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--avatar")
      const image = container.querySelector('[data-testid="image"]')
      const fallback = container.querySelector('[data-testid="fallback"]')

      controller.onImageLoad()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(image.classList.contains("hidden")).toBe(false)
      expect(fallback.classList.contains("hidden")).toBe(true)
    })

    test("hides image and shows fallback on error", async () => {
      container.innerHTML = createAvatar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="avatar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--avatar")
      const image = container.querySelector('[data-testid="image"]')
      const fallback = container.querySelector('[data-testid="fallback"]')

      controller.onImageError()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(image.classList.contains("hidden")).toBe(true)
      expect(fallback.classList.contains("hidden")).toBe(false)
    })
  })

  describe("Show/Hide Methods", () => {
    test("showImage removes hidden class from image", async () => {
      container.innerHTML = createAvatar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="avatar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--avatar")
      const image = container.querySelector('[data-testid="image"]')

      image.classList.add("hidden")
      controller.showImage()

      expect(image.classList.contains("hidden")).toBe(false)
    })

    test("hideImage adds hidden class to image", async () => {
      container.innerHTML = createAvatar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="avatar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--avatar")
      const image = container.querySelector('[data-testid="image"]')

      controller.hideImage()

      expect(image.classList.contains("hidden")).toBe(true)
    })

    test("showFallback removes hidden class from fallback", async () => {
      container.innerHTML = createAvatar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="avatar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--avatar")
      const fallback = container.querySelector('[data-testid="fallback"]')

      controller.showFallback()

      expect(fallback.classList.contains("hidden")).toBe(false)
    })

    test("hideFallback adds hidden class to fallback", async () => {
      container.innerHTML = createAvatar({ showFallback: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="avatar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--avatar")
      const fallback = container.querySelector('[data-testid="fallback"]')

      controller.hideFallback()

      expect(fallback.classList.contains("hidden")).toBe(true)
    })
  })

  describe("Disconnect", () => {
    test("cleans up on disconnect", async () => {
      container.innerHTML = createAvatar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="avatar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--avatar")

      // Should not throw
      controller.disconnect()
    })
  })
})
