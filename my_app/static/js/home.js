
var i;
for (i = 0; i < 10; i++){
  $("#composition-cards").append('<a href="#" class="composition-link"><div class="card composition-card" style="width: 18rem;"><div style="height: 40px; overflow: hidden;"><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M-7.29,83.38 C169.82,181.08 353.49,-33.05 505.83,104.11 L500.00,0.00 L0.00,0.00 Z" style="stroke: none;fill: #007bff;"></path></svg></div><div class="card-body card-info"><h5 class="card-title">Mradul\'s Composition</h5><p class="card-text">I started this song to discover new artistic talents and genres from around the world</p></div><ul class="list-group list-group-flush"><li class="list-group-item">Looking for: Guitar, Piano</li></ul></div></a>');

  if (i == 5 || i == 8){
    $("#composition-cards").append('<a href="#" class="composition-link"><div class="card composition-card" style="width: 18rem;"><div style="height: 40px; overflow: hidden;"><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M-7.29,83.38 C169.82,181.08 353.49,-33.05 505.83,104.11 L500.00,0.00 L0.00,0.00 Z" style="stroke: none;fill: #007bff;"></path></svg></div><div class="card-body card-info"><h5 class="card-title">John\'s Composition</h5><p class="card-text">just a cool song</p></div><ul class="list-group list-group-flush"><li class="list-group-item">Looking for: Guitar, Piano</li></ul></div></a>');


  }

}
