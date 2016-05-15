from django.contrib import admin, messages
from tsdata.models import Dataset, Import
from tsdata.tasks import import_dataset


class DatasetAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'state', 'date_added', 'destination')
    list_filter = ('state',)
    ordering = ('-date_added',)
    search_fields = ('name', 'url')
    date_hierarchy = 'date_added'
    actions = ['import_dataset']

    def import_dataset(self, request, queryset):
        if queryset.count() > 1:
            self.message_user(request, "Please select one dataset at a time",
                              level=messages.ERROR)
            return
        import_dataset.delay(queryset[0].pk)
        msg = "{} successfully queued for import.".format(queryset[0].name)
        self.message_user(request, msg)
    import_dataset.short_description = "Import selected dataset"


class ImportAdmin(admin.ModelAdmin):
    list_display = ('id', 'dataset', 'date_started', 'date_finished',
                    'successful')
    list_filter = ('successful',)
    ordering = ('-date_started',)


admin.site.register(Dataset, DatasetAdmin)
admin.site.register(Import, ImportAdmin)
