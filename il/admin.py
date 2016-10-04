from django.contrib import admin
from il.models import Agency


class AgencyAdmin(admin.ModelAdmin):
    list_display = ('name', 'census_profile_id')


admin.site.register(Agency, AgencyAdmin)
