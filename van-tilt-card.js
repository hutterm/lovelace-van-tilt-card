class VanTiltCard extends HTMLElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="Van Tilt">
          <div class="card-content"></div>
        </ha-card>
      `;
      this.content = this.querySelector('div');
    }

    const rAngle = parseFloat(hass.states[this.config.entity_roll]?.state) ?? 'unavailable';

    const pAngle = parseFloat(hass.states[this.config.entity_pitch]?.state) ?? 'unavailable';
    const pfactor = parseFloat(this.config.pitch_factor) ?? 1;
    const rfactor = parseFloat(this.config.roll_factor) ?? 1;
    const roundTo = parseInt(this.config.round_to) ?? 2;

    const rRotate = (rAngle * rfactor).toString();
    const pRotate = (pAngle * pfactor).toString();
    const rAngleStr = isNaN(rAngle) ? 'unavailable' : rAngle.toFixed(roundTo);
    const pAngleStr = isNaN(pAngle) ? 'unavailable' : pAngle.toFixed(roundTo);

    this.content.innerHTML = `
      <row style="display: flex;">
        <div style="flex: 50%;text-align: center;">
          <img src="/local/van-tilt-card/img/side.png" style="max-width: 100%;height: 100px;transform:rotate(${pRotate}deg);">
          <hr>
          <h1>${pAngleStr}°</h1>
        </div>
        <div style="flex: 50%;text-align: center;">
          <img src="/local/van-tilt-card/img/back.png" style="max-width: 100%;height: 100px;transform:rotate(${rRotate}deg);">
          <hr>
          <h1>${rAngleStr}°</h1>
        </div>
      </row>
    `;
  }

  // The user supplied configuration. Throw an exception and Lovelace will
  // render an error card.
  setConfig(config) {
    if (!config.entity_roll) {
      throw new Error('You need to define an entity_roll');
    }
    if (!config.entity_pitch) {
      throw new Error('You need to define an entity_pitch');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('van-tilt-card', VanTiltCard);

