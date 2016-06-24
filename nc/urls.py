from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from nc import views
from nc import api


router = DefaultRouter()
router.register(r'nc-agency', api.AgencyViewSet, base_name="nc-agency-api")


urlpatterns = [  # noqa
    url(r'^search/$', views.search, name='stops-search'),
    url(r'^agency/$', views.AgencyList.as_view(), name='agency-list'),
    url(r'^agency/(?P<pk>\d+)/$', views.AgencyDetail.as_view(),
        name='agency-detail'),
    url(r'^api/', include(router.urls)),
]
