<template>
  <div>
    <div id="map" class="container" style=""></div>
  </div>
</template>

<script>
export default {
  name: "GoogleTest",
  mounted() {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://chaofun-test.oss-cn-hangzhou.aliyuncs.com/google/js-test.js??key=AIzaSyDvx5IM2bbHnOb4sY-0aISwH8bAxH7ecS4')
    // recaptchaScript.setAttribute('src', 'https://gac-geo.googlecnapps.cn/maps/api/js?key=AIzaSyDvx5IM2bbHnOb4sY-0aISwH8bAxH7ecS4')
    document.head.appendChild(recaptchaScript)
    setTimeout(() => {
      this.test();
    }, 2000)
  },

  methods: {
    test() {

      var panorama = new google.maps.StreetViewPanorama(
          document.getElementById("map"), {
            fullscreenControl: false,
            panControl: false,
            addressControl: false,
            imageDateControl: true,
            motionTrackingControl: false,
            streetViewControl: true
          }
      );


      panorama.setPano('CAoSLEFGMVFpcE9XZnBHQ2s3MEtEc2p0aU1idklDRy1DaHJuSjlfay1CRy1IbXhw');
      panorama.setPov({
        heading: 270,
        pitch: 0,
      });
      panorama.setVisible(true);
    },

  }
}
</script>

<style scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
}

</style>
