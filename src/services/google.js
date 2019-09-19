export function init(id) {
  const script = document.createElement("script");
  script.text =
    "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){" +
    "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o)," +
    "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)" +
    "})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');";
  document.querySelector("body").appendChild(script);

  window.ga =
    window.ga ||
    function() {
      (ga.q = ga.q || []).push(arguments);
    };
  ga.l = +new Date();
  ga("create", id, "auto");
}

export function track(pageValue, titleValue) {
  ga("set", {
    page: pageValue,
    title: titleValue
  });
  ga("send", "pageview");
}
