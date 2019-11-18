import { PropertyHelper } from "./PropHelpers"

const overrideProps = {
  "card-name": {
    css: {
      border: "1px solid"
    },
    placeholder: "New Placeholder",
    color: "#ff8800",
    errorColor: "darkred",
    label: "New Label",
  },
  "card-number": {
    placeholder: "New Placeholder",
    showCardIcon: {
      left: "5px",
    },
  }
}

describe("The PropertyHelper class ", () => {
  it("Should return valid overrideProps", () => {

    const propHelper = new PropertyHelper(overrideProps, {})

    const iframeProps = propHelper.overrideCollectProps("card-name")
    expect(iframeProps).to.have.all.keys("css", "placeholder", "color", "errorColor")

    const fieldProps = propHelper.overrideFieldProps("card-name")
    expect(fieldProps).to.have.keys("label")
  })

  it("Should allow additional props when specified", () => {
    const propHelper = new PropertyHelper(overrideProps, {})
    const iframeProps = propHelper.overrideCollectProps("card-number", ["showCardIcon"])
    expect(iframeProps).to.have.all.keys("placeholder", "showCardIcon")
  })

  it("Should merge inputstyles with specific CSS", () => {
    const propHelper = new PropertyHelper(overrideProps, { backgroundColor: "green" })
    const iframeProps = propHelper.overrideCollectProps("card-name")
    expect(iframeProps.css).to.have.all.keys("backgroundColor", "border")

  })
})
