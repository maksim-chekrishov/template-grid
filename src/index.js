'use strict';

var TemplateGrid = require('./template-grid/template-grid');
var $ = require('jquery');
require('./template-grid/template-grid-plugin')($);

var GridColumn = require('./template-grid/data-objects/template-grid-column');
var GridOptions = require('./template-grid/data-objects/template-grid-options');

var dataService = {
    getFromGlobal: function() {
        return [
            {
                brandUrl: "Acura",
                completionTitle: "A",
                createdAt: null,
                drive: 1,
                finishedAt: null,
                fuel: "11.2",
                fuelType: 1,
                generationUrl: "I",
                id: 25004,
                isArchive: false,
                isAt: true,
                isCompletionOptions: false,
                isOptionsAvaliable: false,
                isPriceUndeclared: false,
                isPublished: true,
                modelSubGenerationId: 3,
                modelSubGenerationNewUrl: "i-sedan4d",
                modelSubUrl: "sedan4d",
                modelUrl: "TLX",
                newUrl: "24DCT-208",
                power: 208,
                price: 1,
                startedAt: Object,
                title: "2.4 DCT",
                updatedAt: Object,
                url: "24dct",
                usage: 20,
                volume: "2356.0",
                warranty: null
            },
            {
                brandUrl: "Acura",
                completionTitle: "B",
                createdAt: null,
                drive: 1,
                finishedAt: null,
                fuel: "7.9",
                fuelType: 1,
                generationUrl: "I",
                id: 25006,
                isArchive: false,
                isAt: true,
                isCompletionOptions: false,
                isOptionsAvaliable: false,
                isPriceUndeclared: false,
                isPublished: true,
                modelSubGenerationId: 3,
                modelSubGenerationNewUrl: "i-sedan4d",
                modelSubUrl: "sedan4d",
                modelUrl: "TLX",
                newUrl: "24DCT-208",
                power: 208,
                price: 21991111,
                startedAt: Object,
                title: "2.4 DCT amp",
                updatedAt: Object,
                url: "24dct",
                usage: 20,
                volume: "2356.0",
                warranty: null
            },
            {
                brandUrl: "Acura",
                completionTitle: "C",
                createdAt: null,
                drive: 1,
                finishedAt: null,
                fuel: "7.9",
                fuelType: 1,
                generationUrl: "I",
                id: 25005,
                isArchive: false,
                isAt: true,
                isCompletionOptions: false,
                isOptionsAvaliable: false,
                isPriceUndeclared: false,
                isPublished: true,
                modelSubGenerationId: 3,
                modelSubGenerationNewUrl: "i-sedan4d asz",
                modelSubUrl: "sedan4d",
                modelUrl: "TLX",
                newUrl: "24DCT-208",
                power: 178,
                price: 33,
                startedAt: Object,
                title: "Cucarara",
                updatedAt: Object,
                url: "24dct",
                usage: 20,
                volume: "2356.0",
                warranty: null
            },
            {
                brandUrl: "Acura23",
                completionTitle: "D",
                createdAt: null,
                drive: 1,
                finishedAt: null,
                fuel: "7.9",
                fuelType: 1,
                generationUrl: "I",
                id: 25005,
                isArchive: false,
                isAt: true,
                isCompletionOptions: false,
                isOptionsAvaliable: false,
                isPriceUndeclared: false,
                isPublished: true,
                modelSubGenerationId: 3,
                modelSubGenerationNewUrl: "ia",
                modelSubUrl: "sedan4d",
                modelUrl: "TLX",
                newUrl: "24DCT-208",
                power: 178,
                price: 33,
                startedAt: Object,
                title: "aCucarara",
                updatedAt: Object,
                url: "24dct",
                usage: 20,
                volume: "2356.0",
                warranty: null
            },
        ]
    }
};

var DRIVE = ['передний', 'задний', 'полный'];
var FUEL = ['бензин', 'дизель'];

initGrid();

function initGrid() {
    var gridColumns = [
        new GridColumn({text: 'Топливо', dataField: 'fuelType', sortable: false, formatter: fuelTypeFormatter}),
        new GridColumn({text: 'Привод', dataField: 'drive', formatter: driveFormatter}),
        new GridColumn({text: 'Расход топлива л/100км', dataField: 'fuel'}),
        new GridColumn({text: 'Название', dataField: 'title', width: 100}),
        new GridColumn({text: 'Комлектация', dataField: 'completionTitle'}),
        new GridColumn({text: 'Цена, руб.', dataField: 'price'})
    ];

    var gridOptions = new GridOptions({
        source: dataService.getFromGlobal('catalogDetails.modifications'),
        columns: gridColumns,
        customBlockClass: 'modifications-grid',
        group: ['fuelType', 'drive', 'fuel']
    });

    var modificationsGrid = $('#grid')
        .templateGrid(gridOptions)
        .templateGrid();

    modificationsGrid.render();
}

function fuelTypeFormatter(cellValue) {
    return cellValue
        ? FUEL[cellValue - 1]
        : gridOptions.noDataText;
}

function driveFormatter(cellValue) {
    return cellValue
        ? DRIVE[cellValue - 1]
        : gridOptions.noDataText;
}

